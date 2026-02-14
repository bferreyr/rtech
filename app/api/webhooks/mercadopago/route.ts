
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { getMPSettings } from "@/app/actions/settings";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        let id = url.searchParams.get("id") || url.searchParams.get("data.id");
        let topic = url.searchParams.get("topic") || url.searchParams.get("type");

        // If not in URL, check body (Mercado Pago sends data in body for some notifications)
        if (!id || !topic) {
            try {
                const body = await req.json();
                id = id || body.data?.id || body.id;
                topic = topic || body.type || body.topic;
                // action: "payment.updated" usually comes in body
                if (body.action === "payment.updated") {
                    topic = "payment";
                }
            } catch (e) {
                // Body might be empty or not JSON, continue
            }
        }

        console.log(`Webhook received - ID: ${id}, Topic: ${topic}`);

        if (topic !== "payment" && topic !== "merchant_order") {
            return NextResponse.json({ status: "ignored" });
        }

        if (!id) {
            console.error("Webhook: Missing ID");
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const settings = await getMPSettings();
        if (!settings.accessToken) {
            console.error("Webhook: Missing Access Token");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const client = new MercadoPagoConfig({ accessToken: settings.accessToken });

        try {
            const paymentDetails = await new Payment(client).get({ id: id });

            if (!paymentDetails) {
                console.warn(`Payment ${id} not found in Mercado Pago`);
                return NextResponse.json({ status: "not_found" }, { status: 404 });
            }

            const externalReference = paymentDetails.external_reference;
            const status = paymentDetails.status;

            console.log(`Payment details - Ref: ${externalReference}, Status: ${status}`);

            if (externalReference) {
                let newStatus = 'PENDING';
                if (status === 'approved') newStatus = 'PAID';
                else if (status === 'rejected' || status === 'cancelled') newStatus = 'CANCELLED';

                if (newStatus !== 'PENDING') {
                    await prisma.order.update({
                        where: { id: externalReference },
                        data: {
                            paymentStatus: newStatus,
                            status: newStatus === 'PAID' ? 'PAID' : undefined,
                            paymentReceiptUrl: `MP_ID:${paymentDetails.id}`
                        }
                    });
                }
            }
        } catch (mpError) {
            console.error(`Error fetching payment ${id} from MP:`, mpError);
            // Return 200 to prevent MP from retrying indefinitely if it's a bad ID (like simulation)
            return NextResponse.json({ status: "error_handled" });
        }

        return NextResponse.json({ status: "success" });

    } catch (error) {
        console.error("Webhook Internal Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { getMPSettings } from "@/app/actions/settings";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        if (topic !== "payment") {
            return NextResponse.json({ status: "ignored" });
        }

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const settings = await getMPSettings();
        if (!settings.accessToken) {
            console.error("MP Webhook: Missing Access Token");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const client = new MercadoPagoConfig({ accessToken: settings.accessToken });
        const paymentDetails = await new Payment(client).get({ id: id });

        if (!paymentDetails) {
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        const externalReference = paymentDetails.external_reference;
        const status = paymentDetails.status;

        if (externalReference) {
            let newStatus = 'PENDING';
            if (status === 'approved') newStatus = 'PAID';
            else if (status === 'rejected' || status === 'cancelled') newStatus = 'CANCELLED';

            if (newStatus !== 'PENDING') {
                await prisma.order.update({
                    where: { id: externalReference },
                    data: {
                        paymentStatus: newStatus,
                        status: newStatus === 'PAID' ? 'PAID' : undefined, // Update main status only if paid
                        paymentReceiptUrl: `MP_ID:${paymentDetails.id}`
                    }
                });

                // Revalidate admin orders page if possible, though this is a server route
                // logic here is independent of frontend cache mostly
            }
        }

        return NextResponse.json({ status: "success" });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

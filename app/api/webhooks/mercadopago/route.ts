import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getMercadoPagoSettings } from "@/app/actions/settings";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const searchParams = request.nextUrl.searchParams;
        const queryId = searchParams.get('data.id') || searchParams.get('id') || body?.data?.id || body?.id;
        const topic = searchParams.get('type') || searchParams.get('topic') || body?.type;

        console.log('MercadoPago Webhook received:', { queryId, topic, body });

        if (!queryId || !topic) {
            return NextResponse.json({ message: 'Missing data' }, { status: 400 });
        }

        // Solo procesar pagos
        if (topic === 'payment') {
            const dbToken = await getMercadoPagoSettings();
            const accessToken = dbToken || process.env.MERCADOPAGO_ACCESS_TOKEN;

            if (!accessToken) {
                console.error('Mercado Pago Access Token not found');
                return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
            }

            const client = new MercadoPagoConfig({ accessToken });
            const payment = new Payment(client);

            // Fetch payment details securely from Mercado Pago
            const paymentData = await payment.get({ id: queryId });

            console.log('Payment status:', paymentData.status);
            console.log('External Reference (Order ID):', paymentData.external_reference);

            if (paymentData.status === 'approved') {
                const orderId = paymentData.external_reference;

                if (!orderId) {
                    console.error('No external_reference found in payment');
                    return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
                }

                // Check if order is already paid to avoid duplicate processing
                const existingOrder = await prisma.order.findUnique({
                    where: { id: orderId }
                });

                if (existingOrder && existingOrder.status === 'PAID') {
                    console.log('Order already processed:', orderId);
                    return NextResponse.json({ message: 'Already processed' });
                }

                // Update Order to PAID
                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'PAID',
                        // @ts-ignore
                        paymentId: String(paymentData.id),
                        // @ts-ignore
                        paymentStatus: paymentData.status
                    }
                });

                // Update Stock and Points
                const order = await prisma.order.findUnique({
                    where: { id: orderId },
                    include: { items: true, user: true }
                });

                if (order) {
                    // Update Stock
                    for (const item of order.items) {
                        await prisma.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: {
                                    decrement: item.quantity
                                }
                            }
                        });
                    }

                    // Award Points: 1 point for every $100 spent (can be adjusted)
                    const pointsToEarn = Math.floor(Number(order.total) / 100);

                    if (pointsToEarn > 0) {
                        await prisma.$transaction([
                            // @ts-ignore
                            prisma.user.update({
                                where: { id: order.userId },
                                // @ts-ignore
                                data: { points: { increment: pointsToEarn } }
                            }),
                            // @ts-ignore
                            prisma.pointHistory.create({
                                data: {
                                    userId: order.userId,
                                    amount: pointsToEarn,
                                    type: 'EARNED',
                                    description: `Puntos ganados por la orden #${order.id.slice(-6)}`
                                }
                            })
                        ]);
                    }
                }

                revalidatePath('/admin/orders');
                revalidatePath('/admin');
                revalidatePath('/admin/users');
                revalidatePath('/profile');
            } else if (paymentData.status === 'rejected' || paymentData.status === 'cancelled') {
                const orderId = paymentData.external_reference;
                if (orderId) {
                    await prisma.order.update({
                        where: { id: orderId },
                        data: {
                            status: 'CANCELLED',
                            paymentStatus: paymentData.status
                        }
                    });
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

// Permitir GET para verificación de MercadoPago
export async function GET() {
    return NextResponse.json({ status: 'Webhook endpoint active' });
}

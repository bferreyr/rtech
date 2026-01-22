import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('MercadoPago Webhook received:', body);

        // Verificar que sea una notificación de pago
        if (body.type === 'payment') {
            const paymentId = body.data.id;

            // Aquí deberías verificar el pago con la API de MercadoPago
            // Por seguridad, NUNCA confíes solo en el webhook sin verificar

            // Ejemplo básico (en producción, verifica el pago con MP API):
            const externalReference = body.external_reference;

            if (externalReference) {
                // Actualizar orden a PAID
                await prisma.order.update({
                    where: { id: externalReference },
                    data: {
                        status: 'PAID'
                    }
                });

                // Actualizar stock de productos y otorgar puntos
                const order = await prisma.order.findUnique({
                    where: { id: externalReference },
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

                    // Award Points: 1 point for every $100 spent
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

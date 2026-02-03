import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getModoSettings } from '@/app/actions/settings';

// Helper to verify signature if applicable (Simplified for now)
// MODO typically sends signature in headers

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // MODO Webhook payload structure verification needed
        // Assuming standard structure: { status: 'COMPLETED', external_id: '...', ... }

        console.log('MODO Webhook received:', body);

        const { status, external_id } = body;

        if (!external_id) {
            return NextResponse.json({ error: 'Missing external_id' }, { status: 400 });
        }

        const orderId = external_id;

        // Map MODO status to our status
        let newStatus: string | null = null;

        if (status === 'COMPLETED' || status === 'APPROVED') {
            newStatus = 'PAID';
        } else if (status === 'REJECTED' || status === 'CANCELLED') {
            newStatus = 'CANCELLED';
        }

        if (newStatus) {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: newStatus as any }
            });
            console.log(`Order ${orderId} updated to ${newStatus}`);

            // If paid, create OCA shipment automatically
            if (newStatus === 'PAID') {
                try {
                    const order = await prisma.order.findUnique({
                        where: { id: orderId },
                        include: {
                            user: true,
                            items: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    });

                    if (order && order.shippingAddress && order.shippingMethod) {
                        // Parse shipping address
                        const addressParts = order.shippingAddress.split(',').map(s => s.trim());
                        const zipMatch = order.shippingAddress.match(/\((\d+)\)/);

                        // Extract shipping option from order metadata or shippingMethod
                        const shippingData = order.shippingMethod ? JSON.parse(order.shippingMethod) : null;

                        if (shippingData && (shippingData.type === 'puerta-puerta' || shippingData.type === 'puerta-sucursal')) {
                            const { createOCAShipment } = await import('@/app/actions/oca');

                            // Calculate total weight and dimensions
                            const totalWeight = order.items.reduce((sum, item) => {
                                const weight = item.product.weight ? Number(item.product.weight) : 1;
                                return sum + (weight * item.quantity);
                            }, 0);

                            // Get dimensions from first product or use defaults
                            const firstProduct = order.items[0]?.product;
                            const dimensions = firstProduct?.dimensions
                                ? JSON.parse(firstProduct.dimensions as string)
                                : { width: 10, height: 10, depth: 10 };

                            const shipmentResult = await createOCAShipment({
                                orderId: order.id,
                                serviceType: shippingData.type,
                                recipient: {
                                    firstName: order.user.name?.split(' ')[0] || 'Cliente',
                                    lastName: order.user.name?.split(' ').slice(1).join(' ') || '',
                                    address: addressParts[0] || '',
                                    number: '0',
                                    city: addressParts[1] || '',
                                    province: addressParts[2]?.replace(/\s*\(\d+\)/, '') || '',
                                    zip: order.shippingZip || zipMatch?.[1] || '',
                                    email: order.user.email,
                                },
                                package: {
                                    weight: totalWeight,
                                    width: dimensions.width,
                                    height: dimensions.height,
                                    depth: dimensions.depth,
                                    declaredValue: Number(order.total),
                                },
                                branchId: shippingData.branchId,
                            });

                            if (shipmentResult.success) {
                                console.log(`OCA Shipment created for order ${orderId}:`, shipmentResult.shipment);
                            } else {
                                console.error(`Failed to create OCA shipment for order ${orderId}:`, shipmentResult.error);
                            }
                        }
                    }
                } catch (shipmentError) {
                    console.error('Error creating OCA shipment:', shipmentError);
                    // Don't fail the webhook if shipment creation fails
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing MODO webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

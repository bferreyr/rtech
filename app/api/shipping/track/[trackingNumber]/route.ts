import { NextRequest, NextResponse } from 'next/server';
import { correoArgentinoService } from '@/lib/correo-argentino';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ trackingNumber: string }> }
) {
    try {
        const { trackingNumber } = await params;

        if (!trackingNumber) {
            return NextResponse.json(
                { error: 'Tracking number is required' },
                { status: 400 }
            );
        }

        // Get tracking info from Correo Argentino
        const trackingData = await correoArgentinoService.getTracking(trackingNumber);

        // Update shipment status in database if exists
        const shipment = await prisma.shipment.findUnique({
            where: { trackingNumber }
        });

        if (shipment) {
            // Map Correo Argentino status to our status enum
            let status = shipment.status;
            const apiStatus = trackingData.status.toLowerCase();

            if (apiStatus.includes('entregado')) {
                status = 'DELIVERED';
            } else if (apiStatus.includes('reparto') || apiStatus.includes('distribución')) {
                status = 'OUT_FOR_DELIVERY';
            } else if (apiStatus.includes('tránsito') || apiStatus.includes('camino')) {
                status = 'IN_TRANSIT';
            }

            // Update shipment status
            await prisma.shipment.update({
                where: { trackingNumber },
                data: {
                    status,
                    metadata: JSON.stringify(trackingData)
                }
            });

            // Update order status if delivered
            if (status === 'DELIVERED') {
                await prisma.order.update({
                    where: { id: shipment.orderId },
                    data: { status: 'DELIVERED' }
                });
            }
        }

        return NextResponse.json({
            trackingNumber: trackingData.trackingNumber,
            status: trackingData.status,
            events: trackingData.events,
            estimatedDelivery: trackingData.estimatedDelivery
        });
    } catch (error: any) {
        console.error('Tracking error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get tracking information' },
            { status: 500 }
        );
    }
}

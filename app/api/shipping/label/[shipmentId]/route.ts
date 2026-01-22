import { NextRequest, NextResponse } from 'next/server';
import { correoArgentinoService } from '@/lib/correo-argentino';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ shipmentId: string }> }
) {
    try {
        const { shipmentId } = await params;

        if (!shipmentId) {
            return NextResponse.json(
                { error: 'Shipment ID is required' },
                { status: 400 }
            );
        }

        // Get shipment from database
        const shipment = await prisma.shipment.findUnique({
            where: { id: shipmentId }
        });

        if (!shipment) {
            return NextResponse.json(
                { error: 'Shipment not found' },
                { status: 404 }
            );
        }

        if (!shipment.trackingNumber) {
            return NextResponse.json(
                { error: 'Tracking number not available for this shipment' },
                { status: 400 }
            );
        }

        // Get label from Correo Argentino
        const labelBuffer = await correoArgentinoService.getLabel(shipment.trackingNumber);

        // Return PDF - Convert Buffer to Uint8Array for NextResponse compatibility
        return new NextResponse(new Uint8Array(labelBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="label-${shipment.trackingNumber}.pdf"`
            }
        });
    } catch (error: any) {
        console.error('Label download error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to download label' },
            { status: 500 }
        );
    }
}

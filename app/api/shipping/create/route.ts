import { NextRequest, NextResponse } from 'next/server';
import { correoArgentinoService } from '@/lib/correo-argentino';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            orderId,
            service,
            serviceCode,
            destinationAddress,
            destinationZip,
            destinationCity,
            destinationProvince,
            recipientName,
            recipientEmail,
            recipientPhone,
            weight,
            dimensions,
            declaredValue
        } = body;

        if (!orderId || !service || !destinationAddress || !destinationZip || !recipientName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if shipment already exists for this order
        const existingShipment = await prisma.shipment.findUnique({
            where: { orderId }
        });

        if (existingShipment) {
            return NextResponse.json(
                { error: 'Shipment already exists for this order' },
                { status: 400 }
            );
        }

        // Create shipment with Correo Argentino
        const shipmentData = await correoArgentinoService.createShipment({
            orderId,
            service: serviceCode || service,
            destinationAddress,
            destinationZip,
            destinationCity: destinationCity || 'Buenos Aires',
            destinationProvince: destinationProvince || 'Buenos Aires',
            recipientName,
            recipientEmail,
            recipientPhone,
            weight: parseFloat(weight),
            dimensions: dimensions ? {
                width: parseFloat(dimensions.width),
                height: parseFloat(dimensions.height),
                depth: parseFloat(dimensions.depth)
            } : undefined,
            declaredValue: declaredValue || parseFloat(order.total.toString())
        });

        // Save shipment to database
        const shipment = await prisma.shipment.create({
            data: {
                orderId,
                trackingNumber: shipmentData.trackingNumber,
                carrier: 'Correo Argentino',
                service,
                cost: shipmentData.cost,
                status: 'LABEL_GENERATED',
                labelUrl: shipmentData.labelUrl,
                estimatedDelivery: new Date(shipmentData.estimatedDelivery),
                metadata: JSON.stringify(shipmentData)
            }
        });

        // Update order status
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'SHIPPED',
                shippingMethod: service
            }
        });

        return NextResponse.json({
            success: true,
            shipment: {
                id: shipment.id,
                trackingNumber: shipment.trackingNumber,
                labelUrl: shipment.labelUrl,
                estimatedDelivery: shipment.estimatedDelivery,
                cost: shipment.cost
            }
        });
    } catch (error: any) {
        console.error('Create shipment error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create shipment' },
            { status: 500 }
        );
    }
}

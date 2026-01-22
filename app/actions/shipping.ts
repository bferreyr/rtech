'use server';

import { correoArgentinoService } from '@/lib/correo-argentino';
import { prisma } from '@/lib/prisma';

export async function calculateShipping(destinationZip: string, weight: number, dimensions?: { width: number; height: number; depth: number }) {
    try {
        const quotes = await correoArgentinoService.quoteShipment({
            destinationZip,
            weight,
            dimensions
        });

        return { success: true, quotes };
    } catch (error: any) {
        console.error('Calculate shipping error:', error);
        return { success: false, error: error.message };
    }
}

export async function createShipmentForOrder(orderId: string, shippingData: {
    service: string;
    serviceCode?: string;
    destinationAddress: string;
    destinationZip: string;
    destinationCity?: string;
    destinationProvince?: string;
    recipientName: string;
    recipientEmail?: string;
    recipientPhone?: string;
}) {
    try {
        // Get order with items
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Calculate total weight from order items
        let totalWeight = 0;
        for (const item of order.items) {
            const productWeight = item.product.weight ? parseFloat(item.product.weight.toString()) : 1;
            totalWeight += productWeight * item.quantity;
        }

        // Create shipment
        const shipmentData = await correoArgentinoService.createShipment({
            orderId,
            service: shippingData.serviceCode || shippingData.service,
            destinationAddress: shippingData.destinationAddress,
            destinationZip: shippingData.destinationZip,
            destinationCity: shippingData.destinationCity || 'Buenos Aires',
            destinationProvince: shippingData.destinationProvince || 'Buenos Aires',
            recipientName: shippingData.recipientName,
            recipientEmail: shippingData.recipientEmail,
            recipientPhone: shippingData.recipientPhone,
            weight: totalWeight,
            declaredValue: parseFloat(order.total.toString())
        });

        // Save to database
        const shipment = await prisma.shipment.create({
            data: {
                orderId,
                trackingNumber: shipmentData.trackingNumber,
                carrier: 'Correo Argentino',
                service: shippingData.service,
                cost: shipmentData.cost,
                status: 'LABEL_GENERATED',
                labelUrl: shipmentData.labelUrl,
                estimatedDelivery: new Date(shipmentData.estimatedDelivery),
                metadata: JSON.stringify(shipmentData)
            }
        });

        // Update order
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'SHIPPED',
                shippingMethod: shippingData.service,
                shippingCost: shipmentData.cost
            }
        });

        return {
            success: true,
            shipment: {
                id: shipment.id,
                trackingNumber: shipment.trackingNumber,
                labelUrl: shipment.labelUrl,
                estimatedDelivery: shipment.estimatedDelivery
            }
        };
    } catch (error: any) {
        console.error('Create shipment error:', error);
        return { success: false, error: error.message };
    }
}

export async function getShipmentTracking(trackingNumber: string) {
    try {
        const trackingData = await correoArgentinoService.getTracking(trackingNumber);
        return { success: true, tracking: trackingData };
    } catch (error: any) {
        console.error('Get tracking error:', error);
        return { success: false, error: error.message };
    }
}

export async function getShipmentsByOrder(orderId: string) {
    try {
        const shipment = await prisma.shipment.findUnique({
            where: { orderId },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        return { success: true, shipment };
    } catch (error: any) {
        console.error('Get shipments error:', error);
        return { success: false, error: error.message };
    }
}

export async function getAllShipments() {
    try {
        const shipments = await prisma.shipment.findMany({
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, shipments };
    } catch (error: any) {
        console.error('Get all shipments error:', error);
        return { success: false, error: error.message };
    }
}

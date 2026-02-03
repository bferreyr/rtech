'use server'

import { ocaService, type QuoteShipmentRequest, type CreateShipmentRequest } from '@/lib/oca';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Quote OCA shipment cost
 */
export async function quoteOCAShipment(params: {
    destinationZip: string;
    weight: number;
    volume: number;
    declaredValue: number;
    serviceType: 'puerta-puerta' | 'puerta-sucursal';
}) {
    try {
        const quote = await ocaService.quoteShipment(params);

        if (!quote) {
            return {
                success: false,
                error: 'No se pudo obtener cotización de OCA',
            };
        }

        return {
            success: true,
            quote,
        };
    } catch (error) {
        console.error('Error quoting OCA shipment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al cotizar envío',
        };
    }
}

/**
 * Get OCA branches by postal code
 */
export async function getOCABranches(zip: string) {
    try {
        const branches = await ocaService.getBranches(zip);

        return {
            success: true,
            branches,
        };
    } catch (error) {
        console.error('Error getting OCA branches:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener sucursales',
            branches: [],
        };
    }
}

/**
 * Create OCA shipment
 */
export async function createOCAShipment(params: {
    orderId: string;
    serviceType: 'puerta-puerta' | 'puerta-sucursal';
    recipient: {
        firstName: string;
        lastName: string;
        address: string;
        number: string;
        floor?: string;
        apartment?: string;
        city: string;
        province: string;
        zip: string;
        phone?: string;
        email?: string;
        observations?: string;
    };
    package: {
        weight: number;
        width: number;
        height: number;
        depth: number;
        declaredValue: number;
    };
    branchId?: string;
}) {
    try {
        const request: CreateShipmentRequest = {
            orderId: params.orderId,
            serviceType: params.serviceType,
            recipient: params.recipient,
            package: {
                ...params.package,
                quantity: 1,
            },
            branchId: params.branchId,
        };

        const result = await ocaService.createShipment(request);

        if (!result.success) {
            return {
                success: false,
                error: result.error || 'Error al crear envío en OCA',
            };
        }

        // Get order to update
        const order = await prisma.order.findUnique({
            where: { id: params.orderId },
        });

        if (!order) {
            return {
                success: false,
                error: 'Orden no encontrada',
            };
        }

        // Get branch name if applicable
        let branchName: string | undefined;
        if (params.branchId) {
            const branches = await ocaService.getBranches(params.recipient.zip);
            const branch = branches.find(b => b.id === params.branchId);
            branchName = branch?.name;
        }

        // Create shipment record
        const shipment = await prisma.shipment.create({
            data: {
                orderId: params.orderId,
                trackingNumber: result.trackingNumber,
                carrier: 'OCA',
                service: params.serviceType === 'puerta-puerta' ? 'Puerta a Puerta' : 'Puerta a Sucursal',
                cost: order.shippingCost || 0,
                status: 'LABEL_GENERATED',
                ocaOrderId: result.ocaOrderId,
                ocaRemito: result.remito,
                ocaBranchId: params.branchId,
                ocaBranchName: branchName,
                metadata: JSON.stringify({
                    recipient: params.recipient,
                    package: params.package,
                }),
            },
        });

        revalidatePath('/admin/shipments');
        revalidatePath(`/admin/orders/${params.orderId}`);

        return {
            success: true,
            shipment: {
                id: shipment.id,
                trackingNumber: shipment.trackingNumber,
                ocaOrderId: shipment.ocaOrderId,
            },
        };
    } catch (error) {
        console.error('Error creating OCA shipment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al crear envío',
        };
    }
}

/**
 * Get OCA label (PDF base64)
 */
export async function getOCALabel(shipmentId: string, format: 'html' | 'pdf' = 'pdf') {
    try {
        const shipment = await prisma.shipment.findUnique({
            where: { id: shipmentId },
        });

        if (!shipment || !shipment.ocaOrderId) {
            return {
                success: false,
                error: 'Envío no encontrado o sin ID de OCA',
            };
        }

        const label = await ocaService.getLabel(shipment.ocaOrderId, format);

        if (!label) {
            return {
                success: false,
                error: 'No se pudo obtener la etiqueta',
            };
        }

        // If PDF, save the URL for future reference
        if (format === 'pdf' && !shipment.labelUrl) {
            await prisma.shipment.update({
                where: { id: shipmentId },
                data: {
                    labelUrl: `data:application/pdf;base64,${label}`,
                },
            });
        }

        return {
            success: true,
            label,
            format,
        };
    } catch (error) {
        console.error('Error getting OCA label:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener etiqueta',
        };
    }
}

/**
 * Get OCA tracking information
 */
export async function getOCATracking(trackingNumber: string) {
    try {
        const tracking = await ocaService.getTracking(trackingNumber);

        if (!tracking) {
            return {
                success: false,
                error: 'No se pudo obtener información de tracking',
            };
        }

        // Update shipment status in database
        const shipment = await prisma.shipment.findUnique({
            where: { trackingNumber },
        });

        if (shipment) {
            // Map OCA status to our ShipmentStatus enum
            let status = shipment.status;
            const ocaStatus = tracking.status.toLowerCase();

            if (ocaStatus.includes('entregado')) {
                status = 'DELIVERED';
            } else if (ocaStatus.includes('reparto') || ocaStatus.includes('distribución')) {
                status = 'OUT_FOR_DELIVERY';
            } else if (ocaStatus.includes('tránsito') || ocaStatus.includes('transito')) {
                status = 'IN_TRANSIT';
            }

            await prisma.shipment.update({
                where: { trackingNumber },
                data: { status },
            });

            revalidatePath('/admin/shipments');
        }

        return {
            success: true,
            tracking,
        };
    } catch (error) {
        console.error('Error getting OCA tracking:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener tracking',
        };
    }
}

/**
 * Cancel OCA shipment
 */
export async function cancelOCAShipment(shipmentId: string) {
    try {
        const shipment = await prisma.shipment.findUnique({
            where: { id: shipmentId },
        });

        if (!shipment || !shipment.ocaOrderId) {
            return {
                success: false,
                error: 'Envío no encontrado o sin ID de OCA',
            };
        }

        const result = await ocaService.cancelShipment(shipment.ocaOrderId);

        if (!result.success) {
            return {
                success: false,
                error: result.message,
            };
        }

        // Update shipment status
        await prisma.shipment.update({
            where: { id: shipmentId },
            data: {
                status: 'CANCELLED',
            },
        });

        revalidatePath('/admin/shipments');
        revalidatePath(`/admin/orders/${shipment.orderId}`);

        return {
            success: true,
            message: result.message,
        };
    } catch (error) {
        console.error('Error canceling OCA shipment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al anular envío',
        };
    }
}

/**
 * Update tracking for all pending shipments
 */
export async function updateAllOCATracking() {
    try {
        const shipments = await prisma.shipment.findMany({
            where: {
                carrier: 'OCA',
                status: {
                    notIn: ['DELIVERED', 'CANCELLED', 'FAILED'],
                },
                trackingNumber: {
                    not: null,
                },
            },
        });

        let updated = 0;
        for (const shipment of shipments) {
            if (shipment.trackingNumber) {
                await getOCATracking(shipment.trackingNumber);
                updated++;
            }
        }

        return {
            success: true,
            updated,
        };
    } catch (error) {
        console.error('Error updating OCA tracking:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al actualizar tracking',
        };
    }
}

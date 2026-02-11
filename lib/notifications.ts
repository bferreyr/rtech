'use server';

import { sendWhatsAppMessage, formatPhoneNumber, isValidPhoneNumber } from './whatsapp';
import { getMessageForStatus, getEstimatedDeliveryText, type OrderData, type OrderStatus } from './whatsapp-templates';
import { prisma } from './prisma';

const WHATSAPP_ENABLED = process.env.WHATSAPP_NOTIFICATIONS_ENABLED === 'true';

export interface NotificationResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export async function sendOrderNotification(
    orderId: string,
    status: OrderStatus,
    phoneNumber?: string | null
): Promise<NotificationResult> {
    // Check if WhatsApp notifications are enabled
    if (!WHATSAPP_ENABLED) {
        console.log('WhatsApp notifications are disabled');
        return { success: false, error: 'WhatsApp notifications disabled' };
    }

    try {
        // Get order data
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Use provided phone number or order's phone number
        const phone = phoneNumber || order.customerPhone;

        if (!phone) {
            console.log(`No phone number for order ${orderId}`);
            return { success: false, error: 'No phone number provided' };
        }

        // Validate and format phone number
        if (!isValidPhoneNumber(phone)) {
            console.log(`Invalid phone number: ${phone}`);
            return { success: false, error: 'Invalid phone number' };
        }

        const formattedPhone = formatPhoneNumber(phone);

        // Prepare order data for template
        const orderData: OrderData = {
            id: order.id,
            customerName: order.customerName,
            total: parseFloat(order.total.toString()),
            createdAt: order.createdAt,
            trackingUrl: order.trackingUrl,
            estimatedDelivery: getEstimatedDeliveryText(order.shippingType),
        };

        // Get message for status
        const message = getMessageForStatus(status, orderData);

        // Send WhatsApp message
        const result = await sendWhatsAppMessage({
            to: formattedPhone,
            body: message,
        });

        // Log notification attempt
        await prisma.notificationLog.create({
            data: {
                orderId: order.id,
                type: `order_${status.toLowerCase()}`,
                phoneNumber: formattedPhone,
                status: result.success ? 'sent' : 'failed',
                messageId: result.messageId,
                error: result.error,
            },
        });

        // Update order's notification tracking
        if (result.success) {
            const notifications = (order.whatsappNotificationsSent as any) || {};
            notifications[status] = {
                sentAt: new Date().toISOString(),
                messageId: result.messageId,
            };

            await prisma.order.update({
                where: { id: order.id },
                data: {
                    whatsappNotificationsSent: notifications,
                },
            });
        }

        return result;
    } catch (error: any) {
        console.error('Error sending order notification:', error);

        // Log failed attempt
        try {
            await prisma.notificationLog.create({
                data: {
                    orderId,
                    type: `order_${status.toLowerCase()}`,
                    phoneNumber: phoneNumber || 'unknown',
                    status: 'failed',
                    error: error.message || 'Unknown error',
                },
            });
        } catch (logError) {
            console.error('Failed to log notification error:', logError);
        }

        return {
            success: false,
            error: error.message || 'Failed to send notification',
        };
    }
}

export async function sendTestNotification(phoneNumber: string): Promise<NotificationResult> {
    if (!isValidPhoneNumber(phoneNumber)) {
        return { success: false, error: 'Invalid phone number' };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const testMessage = `🧪 Mensaje de Prueba - RTECH

¡Hola! Este es un mensaje de prueba del sistema de notificaciones de WhatsApp.

Si recibiste este mensaje, la integración está funcionando correctamente. ✅`;

    const result = await sendWhatsAppMessage({
        to: formattedPhone,
        body: testMessage,
    });

    // Log test notification
    try {
        await prisma.notificationLog.create({
            data: {
                orderId: 'test',
                type: 'test_message',
                phoneNumber: formattedPhone,
                status: result.success ? 'sent' : 'failed',
                messageId: result.messageId,
                error: result.error,
            },
        });
    } catch (error) {
        console.error('Failed to log test notification:', error);
    }

    return result;
}

export async function getNotificationLogs(orderId?: string, limit: number = 50) {
    const where = orderId ? { orderId } : {};

    return await prisma.notificationLog.findMany({
        where,
        orderBy: { sentAt: 'desc' },
        take: limit,
        include: {
            order: {
                select: {
                    id: true,
                    customerName: true,
                    status: true,
                },
            },
        },
    });
}

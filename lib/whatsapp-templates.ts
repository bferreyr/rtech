export interface OrderData {
    id: string;
    customerName: string;
    total: number;
    createdAt: Date;
    trackingUrl?: string | null;
    estimatedDelivery?: string;
}

export function getOrderConfirmationMessage(order: OrderData): string {
    return `¡Hola ${order.customerName}! 🎉

Tu pedido #${order.id.slice(-8).toUpperCase()} ha sido confirmado.

📦 Total: USD ${order.total.toFixed(2)}
📅 Fecha: ${order.createdAt.toLocaleDateString('es-AR')}

Te mantendremos informado sobre el estado de tu envío.

¡Gracias por tu compra!`;
}

export function getPaymentConfirmedMessage(order: OrderData): string {
    return `Hola ${order.customerName},

✅ Pago confirmado para pedido #${order.id.slice(-8).toUpperCase()}

Estamos preparando tu pedido para el envío.

Total: USD ${order.total.toFixed(2)}`;
}

export function getOrderShippedMessage(order: OrderData): string {
    const trackingInfo = order.trackingUrl
        ? `\n\n🚚 Seguimiento: ${order.trackingUrl}`
        : '';

    const deliveryInfo = order.estimatedDelivery
        ? `\n\nTiempo estimado de entrega: ${order.estimatedDelivery}`
        : '';

    return `¡Tu pedido está en camino! 📦

Hola ${order.customerName},

Tu pedido #${order.id.slice(-8).toUpperCase()} ha sido enviado.${trackingInfo}${deliveryInfo}`;
}

export function getOrderDeliveredMessage(order: OrderData): string {
    return `¡Entregado! ✅

Hola ${order.customerName},

Tu pedido #${order.id.slice(-8).toUpperCase()} ha sido entregado.

Esperamos que disfrutes tu compra. Si tenés algún problema, contactanos.

¡Gracias por elegirnos!`;
}

export function getOrderCancelledMessage(order: OrderData): string {
    return `Pedido Cancelado

Hola ${order.customerName},

Tu pedido #${order.id.slice(-8).toUpperCase()} ha sido cancelado.

Si tenés dudas, contactanos.`;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export function getMessageForStatus(status: OrderStatus, order: OrderData): string {
    switch (status) {
        case 'PENDING':
            return getOrderConfirmationMessage(order);
        case 'PAID':
            return getPaymentConfirmedMessage(order);
        case 'SHIPPED':
            return getOrderShippedMessage(order);
        case 'DELIVERED':
            return getOrderDeliveredMessage(order);
        case 'CANCELLED':
            return getOrderCancelledMessage(order);
        default:
            return getOrderConfirmationMessage(order);
    }
}

export function getEstimatedDeliveryText(shippingType: string): string {
    switch (shippingType) {
        case 'EXPRESS':
            return '1 a 3 días hábiles';
        case 'STANDARD':
            return '2 a 5 días hábiles';
        case 'PICKUP':
            return '1 día hábil si compraste antes de las 9:00 AM';
        default:
            return '2 a 5 días hábiles';
    }
}

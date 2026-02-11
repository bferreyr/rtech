import { OrderStatus } from '@prisma/client';
import { Package, Clock, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react';

export interface OrderStatusInfo {
    label: string;
    color: string;
    bgColor: string;
    icon: typeof Package;
    description: string;
}

export const ORDER_STATUS_INFO: Record<OrderStatus, OrderStatusInfo> = {
    PENDING: {
        label: 'Pendiente',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        icon: Clock,
        description: 'Tu pedido ha sido recibido y está pendiente de pago'
    },
    PAID: {
        label: 'Pagado',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        icon: CreditCard,
        description: 'Pago confirmado, estamos preparando tu pedido'
    },
    SHIPPED: {
        label: 'Enviado',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        icon: Truck,
        description: 'Tu pedido está en camino'
    },
    DELIVERED: {
        label: 'Entregado',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        icon: CheckCircle,
        description: 'Tu pedido ha sido entregado'
    },
    CANCELLED: {
        label: 'Cancelado',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        icon: XCircle,
        description: 'Este pedido ha sido cancelado'
    }
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
    'PENDING',
    'PAID',
    'SHIPPED',
    'DELIVERED'
];

export function getStatusIndex(status: OrderStatus): number {
    return ORDER_STATUS_FLOW.indexOf(status);
}

export function isStatusCompleted(currentStatus: OrderStatus, checkStatus: OrderStatus): boolean {
    const currentIndex = getStatusIndex(currentStatus);
    const checkIndex = getStatusIndex(checkStatus);

    if (currentStatus === 'CANCELLED') {
        return checkStatus === 'CANCELLED';
    }

    return currentIndex >= checkIndex;
}

export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const currentIndex = getStatusIndex(currentStatus);
    if (currentIndex === -1 || currentIndex === ORDER_STATUS_FLOW.length - 1) {
        return null;
    }
    return ORDER_STATUS_FLOW[currentIndex + 1];
}

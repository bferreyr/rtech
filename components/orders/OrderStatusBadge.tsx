'use client';

import { OrderStatus } from '@prisma/client';
import { ORDER_STATUS_INFO } from '@/lib/order-status';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: 'sm' | 'md' | 'lg';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
    const statusInfo = ORDER_STATUS_INFO[status];
    const Icon = statusInfo.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16
    };

    return (
        <div className={`inline-flex items-center gap-2 rounded-full ${statusInfo.bgColor} ${statusInfo.color} ${sizeClasses[size]} font-medium`}>
            <Icon size={iconSizes[size]} />
            <span>{statusInfo.label}</span>
        </div>
    );
}

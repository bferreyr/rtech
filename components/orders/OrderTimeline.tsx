'use client';

import { OrderStatus } from '@prisma/client';
import { ORDER_STATUS_INFO, ORDER_STATUS_FLOW, isStatusCompleted } from '@/lib/order-status';
import { Check } from 'lucide-react';

interface OrderTimelineProps {
    currentStatus: OrderStatus;
    trackingUrl?: string | null;
}

export function OrderTimeline({ currentStatus, trackingUrl }: OrderTimelineProps) {
    // Don't show timeline for cancelled orders
    if (currentStatus === 'CANCELLED') {
        const cancelledInfo = ORDER_STATUS_INFO.CANCELLED;
        const Icon = cancelledInfo.icon;

        return (
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${cancelledInfo.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${cancelledInfo.color}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{cancelledInfo.label}</h3>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">{cancelledInfo.description}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-6">Estado del Pedido</h3>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[hsl(var(--border-color))]" />

                <div className="space-y-8">
                    {ORDER_STATUS_FLOW.map((status, index) => {
                        const statusInfo = ORDER_STATUS_INFO[status];
                        const Icon = statusInfo.icon;
                        const isCompleted = isStatusCompleted(currentStatus, status);
                        const isCurrent = currentStatus === status;

                        return (
                            <div key={status} className="relative flex items-start gap-4">
                                {/* Icon circle */}
                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                                        ? `${statusInfo.bgColor} ${statusInfo.color}`
                                        : 'bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-secondary))]'
                                    }`}>
                                    {isCompleted && !isCurrent ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <Icon className="w-6 h-6" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-2">
                                    <h4 className={`font-semibold ${isCurrent ? statusInfo.color : ''}`}>
                                        {statusInfo.label}
                                    </h4>
                                    <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">
                                        {statusInfo.description}
                                    </p>

                                    {/* Show tracking link when shipped */}
                                    {status === 'SHIPPED' && isCurrent && trackingUrl && (
                                        <a
                                            href={trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-3 text-sm text-[hsl(var(--accent-primary))] hover:underline"
                                        >
                                            <Icon className="w-4 h-4" />
                                            Ver seguimiento de Correo Argentino
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

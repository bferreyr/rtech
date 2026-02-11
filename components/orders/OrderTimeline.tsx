'use client';

import { OrderStatus } from '@prisma/client';
import { ORDER_STATUS_INFO, ORDER_STATUS_FLOW, isStatusCompleted, getStatusIndex } from '@/lib/order-status';
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

    const currentIndex = getStatusIndex(currentStatus);
    const totalSteps = ORDER_STATUS_FLOW.length;
    const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;

    return (
        <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-6">Estado del Pedido</h3>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="relative h-2 bg-[hsl(var(--bg-tertiary))] rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    {ORDER_STATUS_FLOW.map((status, index) => {
                        const statusInfo = ORDER_STATUS_INFO[status];
                        const isCompleted = isStatusCompleted(currentStatus, status);
                        const isCurrent = currentStatus === status;

                        return (
                            <div key={status} className="flex flex-col items-center" style={{ width: `${100 / totalSteps}%` }}>
                                <div className={`w-3 h-3 rounded-full -mt-[22px] transition-all ${isCompleted
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 ring-4 ring-blue-500/20'
                                        : 'bg-[hsl(var(--bg-tertiary))]'
                                    }`} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Status Cards */}
            <div className="space-y-4">
                {ORDER_STATUS_FLOW.map((status, index) => {
                    const statusInfo = ORDER_STATUS_INFO[status];
                    const Icon = statusInfo.icon;
                    const isCompleted = isStatusCompleted(currentStatus, status);
                    const isCurrent = currentStatus === status;

                    return (
                        <div
                            key={status}
                            className={`flex items-start gap-4 p-4 rounded-lg transition-all ${isCurrent
                                    ? `${statusInfo.bgColor} border-2 border-current ${statusInfo.color}`
                                    : isCompleted
                                        ? 'bg-[hsl(var(--bg-tertiary))]'
                                        : 'bg-[hsl(var(--bg-tertiary))] opacity-50'
                                }`}
                        >
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                    ? `${statusInfo.bgColor} ${statusInfo.color}`
                                    : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))]'
                                }`}>
                                {isCompleted && !isCurrent ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h4 className={`font-semibold ${isCurrent ? statusInfo.color : ''}`}>
                                    {statusInfo.label}
                                    {isCurrent && <span className="ml-2 text-xs">(Actual)</span>}
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
    );
}

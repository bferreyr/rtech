'use client';

import { Truck, Building2, Zap } from 'lucide-react';
import { SHIPPING_TYPES } from '@/lib/shipping-utils';

interface ShippingOption {
    type: string;
    label: string;
    description: string;
    estimatedTime: string;
    icon: React.ReactNode;
    isFree?: boolean;
}

interface ShippingOptionsProps {
    selectedType: string;
    onSelect: (type: string) => void;
    isFreeShipping?: boolean;
}

export function ShippingOptions({ selectedType, onSelect, isFreeShipping }: ShippingOptionsProps) {
    const options: ShippingOption[] = [
        {
            type: SHIPPING_TYPES.STANDARD,
            label: 'Envío Standard',
            description: 'Corre por cuenta del cliente',
            estimatedTime: '2 a 5 días hábiles',
            icon: <Truck className="w-5 h-5" />,
        },
        {
            type: SHIPPING_TYPES.EXPRESS,
            label: 'Envío Express',
            description: 'Corre por cuenta del cliente',
            estimatedTime: '1 a 3 días hábiles',
            icon: <Zap className="w-5 h-5" />,
        },
        {
            type: SHIPPING_TYPES.PICKUP,
            label: 'Retiro en Tienda',
            description: 'Retiro gratuito en nuestra dirección',
            estimatedTime: '1 día hábil si comprás antes de las 9:00 AM',
            icon: <Building2 className="w-5 h-5" />,
            isFree: true,
        },
    ];

    return (
        <div className="space-y-3">
            {options.map((option) => (
                <div
                    key={option.type}
                    onClick={() => onSelect(option.type)}
                    className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${selectedType === option.type
                            ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                            : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--accent-primary))]/50'
                        }
                    `}
                >
                    <div className="flex items-start gap-3">
                        <input
                            type="radio"
                            name="shippingType"
                            value={option.type}
                            checked={selectedType === option.type}
                            onChange={() => onSelect(option.type)}
                            className="mt-1 w-4 h-4"
                        />

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{option.label}</p>
                                {(option.isFree || (isFreeShipping && option.type !== SHIPPING_TYPES.PICKUP)) && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/20 text-green-400 font-semibold">
                                        GRATIS
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-[hsl(var(--text-secondary))]">
                                {option.description}
                            </p>

                            <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">
                                {option.estimatedTime}
                            </p>
                        </div>

                        <div className={`
                            ${selectedType === option.type
                                ? 'text-[hsl(var(--accent-primary))]'
                                : 'text-[hsl(var(--text-secondary))]'
                            }
                        `}>
                            {option.icon}
                        </div>
                    </div>
                </div>
            ))}

            {/* Free Shipping Notice */}
            {isFreeShipping && selectedType !== SHIPPING_TYPES.PICKUP && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-400 font-medium">
                        ✓ ¡Envío gratis! Tu dirección está en Santa Fe Capital o zona de la costa
                    </p>
                    <p className="text-xs text-[hsl(var(--text-secondary))] mt-1">
                        (Santa Fe Capital, Colastine Norte/Centro/Sur, San José del Rincón, Arroyo Leyes)
                    </p>
                </div>
            )}
        </div>
    );
}

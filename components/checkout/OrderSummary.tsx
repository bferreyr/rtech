'use client';

import Image from 'next/image';
import { ShoppingBag, Lock, Truck } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { CartItem } from '@/context/CartContext';


interface OrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    shippingCostARS?: number;
    isFreeShipping?: boolean;
    total: number;
    onCheckout?: () => void;
    checkoutDisabled?: boolean;
    checkoutLoading?: boolean;
}

export function OrderSummary({
    items,
    subtotal,
    shippingCost,
    shippingCostARS = 0,
    isFreeShipping = false,
    total,
    onCheckout,
    checkoutDisabled,
    checkoutLoading
}: OrderSummaryProps) {
    const { formatUSD, formatARS, toARS } = useCurrency();

    // Formateador directo en ARS (sin conversión USD→ARS)
    const formatARSDirect = (amount: number) =>
        new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

    return (
        <div className="glass-card p-6 sticky top-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <ShoppingBag className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
                <h3 className="text-xl font-bold">Resumen del Pedido</h3>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-[hsl(var(--bg-tertiary))] overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-[hsl(var(--text-tertiary))]" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-[hsl(var(--text-secondary))]">
                                Cantidad: {item.quantity}
                            </p>
                            <p className="text-sm font-bold text-[hsl(var(--accent-primary))]">
                                {formatUSD(item.price * item.quantity)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--text-secondary))]">Subtotal productos</span>
                    <span className="font-medium">{formatUSD(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[hsl(var(--text-secondary))]">
                        <Truck className="w-3.5 h-3.5" />
                        Costo de envío
                    </span>
                    <span className="font-medium">
                        {isFreeShipping || shippingCostARS === 0 ? (
                            <span className="text-green-400 font-semibold">Gratis</span>
                        ) : (
                            <span className="text-[hsl(var(--accent-primary))] font-semibold">
                                {formatARSDirect(shippingCostARS)}
                            </span>
                        )}
                    </span>
                </div>

                <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold">Total</span>
                        <div className="text-right">
                            <p className="text-2xl font-black bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent">
                                {formatUSD(total)}
                            </p>
                            <p className="text-sm text-[hsl(var(--text-secondary))]">
                                {formatARSDirect(toARS(total) + shippingCostARS)}
                                {shippingCostARS > 0 && (
                                    <span className="ml-1 text-xs opacity-60">(incl. envío)</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            {onCheckout && (
                <button
                    onClick={onCheckout}
                    disabled={checkoutDisabled || checkoutLoading}
                    className="w-full btn btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {checkoutLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Procesando...
                        </span>
                    ) : (
                        'Finalizar Compra'
                    )}
                </button>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-[hsl(var(--text-secondary))]">
                <Lock className="w-4 h-4" />
                <span>Compra 100% segura</span>
            </div>
        </div>
    );
}

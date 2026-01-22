'use client';

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

export function CartSidebar() {
    const { isOpen, toggleCart, items, removeItem, updateQuantity, cartTotal } = useCart();
    const { formatUSD, formatARS } = useCurrency();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
                    onClick={toggleCart}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`
                fixed top-0 right-0 h-full w-full sm:w-[450px] z-[70]
                glass-card border-l border-white/10 shadow-2xl
                transform transition-transform duration-500 ease-out
                flex flex-col
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-[hsl(var(--accent-primary))]" />
                        <h2 className="text-2xl font-bold">Tu Carrito</h2>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <ShoppingBag className="w-16 h-16 text-[hsl(var(--text-tertiary))] mb-4 opacity-50" />
                            <p className="text-[hsl(var(--text-secondary))] mb-2">Tu carrito está vacío</p>
                            <button onClick={toggleCart} className="text-sm text-[hsl(var(--accent-primary))] hover:underline">
                                Explorar productos
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="glass-card p-4 group hover:border-white/20 transition-all">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-20 h-20 rounded-lg bg-[hsl(var(--bg-tertiary))] overflow-hidden flex-shrink-0">
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
                                        <div className="space-y-0.5">
                                            <p className="text-lg font-bold gradient-text">
                                                {formatUSD(item.price)}
                                            </p>
                                            <p className="text-xs text-[hsl(var(--text-secondary))] font-medium">
                                                ≈ {formatARS(item.price)}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center gap-2 bg-[hsl(var(--bg-primary))] rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1.5 hover:bg-white/5 rounded transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-medium text-sm">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1.5 hover:bg-white/5 rounded transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-white/10 p-6 space-y-4 bg-[hsl(var(--bg-primary))]">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[hsl(var(--text-secondary))]">Total</span>
                                <span className="text-3xl font-black gradient-text">
                                    {formatUSD(cartTotal)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-white/5 pt-2">
                                <span className="text-[hsl(var(--text-tertiary))]">Subtotal en ARS</span>
                                <span className="font-bold text-[hsl(var(--text-secondary))]">
                                    {formatARS(cartTotal)}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={toggleCart}
                            className="btn btn-primary w-full text-lg py-4 group"
                        >
                            Proceder al Pago
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button
                            onClick={toggleCart}
                            className="w-full text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
                        >
                            Continuar comprando
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

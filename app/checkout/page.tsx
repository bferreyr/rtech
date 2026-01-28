'use client';

import { useCart } from "@/context/CartContext";
import { createModoPreference } from "@/app/actions/modo";
// ... (imports)

// ... inside component ...
try {
    const result = await createModoPreference({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        total: calculatedTotal,
        items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            title: item.name
        })),
        shippingAddress: {
            address: formData.address,
            city: formData.city,
            province: formData.province,
            zip: formData.zip
        },
        shippingOption: selectedShipping ? {
            name: selectedShipping.name,
            cost: selectedShipping.price
        } : undefined,
        pointsToRedeem: redeemPoints ? (session?.user as any)?.points : 0
    });


    if (result.success && result.initPoint) {
        clearCart();
        // Redirect to MODO
        window.location.href = result.initPoint;
    } else {
        setError(result.error || "Error al iniciar el pago");
        setIsProcessing(false);
    }
} catch (err) {
    console.error(err);
    setError("Ocurrió un error inesperado");
    setIsProcessing(false);
}
// ...

// ... inside JSX ...
                                    <button
                                        onClick={handlePayment}
                                        disabled={isProcessing || !formData.email || !formData.address}
                                        className="w-full py-4 bg-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent-primary))]/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Redirigiendo a MODO...
                                            </>
                                        ) : (
                                            <>
                                                Pagar con MODO
                                            </>
                                        )}
                                    </button>
                                    
                                    <div className="flex items-center justify-center gap-2 mt-4 opacity-50">
                                        <p className="text-xs text-center">Pagos seguros procesados por</p>
                                        <img src="https://brand.modo.com.ar/brand/logo-modo-black.svg" alt="MODO" className="h-4 invert" />
                                    </div>
// ...
import { useState, useTransition, useMemo } from "react";
import { ShoppingBag, CreditCard, User, Mail, ArrowRight, Loader2, MapPin, Coins } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ShippingCalculator } from "@/components/checkout/ShippingCalculator";
import { useCurrency } from "@/context/CurrencyContext";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
    const { data: session } = useSession();
    const { items, cartTotal, clearCart } = useCart();
    const { formatUSD, formatARS, toARS } = useCurrency();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [shippingOption, setShippingOption] = useState<any>(null);
    const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        province: '',
        zip: ''
    });

    // Calculate total weight from cart items (default 1kg per item if no weight)
    const totalWeight = useMemo(() => {
        return items.reduce((sum, item) => sum + (1 * item.quantity), 0); // Default 1kg per product
    }, [items]);

    const finalTotal = cartTotal + (shippingOption?.cost || 0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const name = formData.get('name') as string;

        if (items.length === 0) {
            setError('Tu carrito está vacío');
            return;
        }

        startTransition(async () => {
            const result = await createMercadoPagoPreference({
                email,
                name,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: Number(item.price),
                    title: item.name
                })),
                total: finalTotal, // Use finalTotal including shipping
                shippingAddress,
                shippingOption,
                pointsToRedeem
            });

            if (result.success && result.initPoint) {
                clearCart();
                window.location.href = result.initPoint;
            } else {
                setError(result.error || 'Error al procesar el pago');
            }
        });
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">Tu carrito está vacío</h1>
                    <p className="text-[hsl(var(--text-secondary))]">
                        Agrega productos antes de proceder al checkout
                    </p>
                    <Link href="/products" className="btn btn-primary inline-flex">
                        Ver Productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Finalizar Compra</h1>
                    <p className="text-[hsl(var(--text-secondary))]">Completa tus datos para procesar el pedido</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Information */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Información Personal</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Dirección de Envío</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium mb-2">
                                            Dirección *
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            required
                                            value={shippingAddress.address}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all"
                                            placeholder="Calle y número"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium mb-2">
                                                Ciudad *
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                required
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all"
                                                placeholder="Buenos Aires"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="province" className="block text-sm font-medium mb-2">
                                                Provincia *
                                            </label>
                                            <input
                                                type="text"
                                                id="province"
                                                name="province"
                                                required
                                                value={shippingAddress.province}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all"
                                                placeholder="Buenos Aires"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Calculator */}
                            <ShippingCalculator
                                totalWeight={totalWeight}
                                selectedOption={shippingOption}
                                onSelectShipping={(option) => {
                                    setShippingOption(option);
                                    setShippingAddress({ ...shippingAddress, zip: '' });
                                }}
                            />

                            {/* Loyalty Points */}
                            {/* @ts-ignore */}
                            {session && (session.user as any).points > 0 && (
                                <div className="glass-card p-8 border-[hsl(var(--accent-secondary))]/30">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-secondary))] to-[#ec4899] flex items-center justify-center">
                                            <Coins className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Puntos RTECH</h2>
                                            <p className="text-xs text-[hsl(var(--text-tertiary))]">Tenés {(session.user as any).points} puntos disponibles</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium">¿Querés usar tus puntos?</span>
                                            <span className="text-xs font-bold text-[hsl(var(--accent-secondary))]">1 Punto = $1 USD</span>
                                        </div>

                                        <input
                                            type="range"
                                            min="0"
                                            max={Math.min((session?.user as any)?.points || 0, Math.floor(finalTotal * 0.5))}
                                            value={pointsToRedeem}
                                            onChange={(e) => setPointsToRedeem(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[hsl(var(--accent-secondary))]"
                                        />

                                        <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--text-tertiary))]">
                                            <span>0 puntos</span>
                                            <span>Máximo: {Math.min((session?.user as any)?.points || 0, Math.floor(finalTotal * 0.5))} puntos</span>
                                        </div>

                                        {pointsToRedeem > 0 && (
                                            <div className="mt-6 p-4 rounded-lg bg-[hsl(var(--accent-secondary))]/10 border border-[hsl(var(--accent-secondary))]/20 flex items-center justify-between">
                                                <span className="text-sm font-medium">Descuento aplicado:</span>
                                                <span className="text-lg font-black text-[hsl(var(--accent-secondary))]">-${pointsToRedeem}.00 USD</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Payment Method */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Método de Pago</h2>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <svg className="w-12 h-12" viewBox="0 0 200 200" fill="none">
                                        <rect width="200" height="200" rx="20" fill="#009EE3" />
                                        <path d="M70 80h60v40H70z" fill="white" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">MercadoPago</p>
                                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                                            Pago seguro con tarjeta, efectivo o transferencia
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-red-300">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="btn btn-primary w-full text-lg py-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Redirigiendo a MercadoPago...
                                    </>
                                ) : (
                                    <>
                                        Pagar con MercadoPago
                                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Resumen del Pedido</h3>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-[hsl(var(--bg-tertiary))] overflow-hidden flex-shrink-0">
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-[hsl(var(--text-secondary))]">
                                                Cantidad: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-bold text-sm">
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[hsl(var(--border-color))] pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[hsl(var(--text-secondary))]">Subtotal</span>
                                    <span>{formatUSD(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[hsl(var(--text-secondary))]">Envío</span>
                                    {shippingOption ? (
                                        <span>{formatUSD(shippingOption.cost)}</span>
                                    ) : (
                                        <span className="text-[hsl(var(--text-tertiary))]">Calcular</span>
                                    )}
                                </div>
                                {pointsToRedeem > 0 && (
                                    <div className="flex justify-between text-sm text-[hsl(var(--accent-secondary))] font-bold">
                                        <span>Descuento Puntos</span>
                                        <span>-{formatUSD(pointsToRedeem)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-baseline pt-2 border-t border-[hsl(var(--border-color))]">
                                    <span className="text-xl font-bold">Total</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-black gradient-text">
                                            {formatUSD(finalTotal - pointsToRedeem)}
                                        </div>
                                        <div className="text-sm font-bold text-[hsl(var(--text-secondary))] mt-0.5">
                                            ≈ {formatARS(finalTotal - pointsToRedeem)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

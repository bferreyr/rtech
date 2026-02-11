'use client';

import { useState, useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, CreditCard, User, Mail, ArrowRight, Loader2, MapPin, Truck, Phone, FileText, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import { useSession } from "next-auth/react";
import { LocationSelector } from "@/components/checkout/LocationSelector";
import { ReceiptUpload } from "@/components/checkout/ReceiptUpload";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { items, cartTotal, clearCart } = useCart();
    const { formatARS, toARS } = useCurrency();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [details, setDetails] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transferencia' | ''>('');
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    // Shipping is free - no cost
    const shippingCost = 0;
    const finalTotal = cartTotal; // cartTotal is already in USD

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (items.length === 0) {
            setError('Tu carrito está vacío');
            return;
        }

        if (!paymentMethod) {
            setError('Por favor seleccioná un método de pago');
            return;
        }

        if (paymentMethod === 'transferencia' && !receiptFile) {
            setError('Por favor subí el comprobante de pago');
            return;
        }

        startTransition(async () => {
            try {
                let receiptUrl = null;

                // Upload receipt if transferencia
                if (paymentMethod === 'transferencia' && receiptFile) {
                    const formData = new FormData();
                    formData.append('receipt', receiptFile);

                    const uploadRes = await fetch('/api/upload/receipt', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!uploadRes.ok) {
                        throw new Error('Error al subir el comprobante');
                    }

                    const uploadData = await uploadRes.json();
                    receiptUrl = uploadData.url;
                }

                // Create order
                const orderData = {
                    customerName,
                    customerEmail,
                    customerPhone,
                    shippingAddress: address,
                    shippingProvince: province,
                    shippingCity: city,
                    shippingZip: zip,
                    shippingDetails: details || null,
                    shippingCost,
                    paymentMethod,
                    paymentReceiptUrl: receiptUrl,
                    items: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    total: finalTotal,
                };

                const response = await fetch('/api/orders/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Error al crear el pedido');
                }

                const order = await response.json();

                // Clear cart
                clearCart();
                setSuccess(true);

                // Redirect based on payment method
                if (paymentMethod === 'mercadopago') {
                    // Redirect to MercadoPago with amount
                    window.location.href = `https://link.mercadopago.com.ar/rincontech?amount=${finalTotal}`;
                } else {
                    // Redirect to success page
                    router.push(`/orders/${order.id}?success=true`);
                }

            } catch (err: any) {
                setError(err.message || 'Error al procesar el pedido');
            }
        });
    };

    if (items.length === 0 && !success) {
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
                                            Nombre y Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            Correo Electrónico *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-secondary))]" />
                                            <input
                                                type="email"
                                                id="email"
                                                value={customerEmail}
                                                onChange={(e) => setCustomerEmail(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                            Teléfono de Contacto *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-secondary))]" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors"
                                                placeholder="+54 11 1234-5678"
                                            />
                                        </div>
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
                                            Dirección y Altura *
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors"
                                            placeholder="Av. Corrientes 1234"
                                        />
                                    </div>

                                    <LocationSelector
                                        selectedProvince={province}
                                        selectedCity={city}
                                        onProvinceChange={setProvince}
                                        onCityChange={setCity}
                                    />

                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium mb-2">
                                            Código Postal *
                                        </label>
                                        <input
                                            type="text"
                                            id="zip"
                                            value={zip}
                                            onChange={(e) => setZip(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors"
                                            placeholder="C1043"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="details" className="block text-sm font-medium mb-2">
                                            Descripción (Casa, Depto, Piso, Número)
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 w-5 h-5 text-[hsl(var(--text-secondary))]" />
                                            <textarea
                                                id="details"
                                                value={details}
                                                onChange={(e) => setDetails(e.target.value)}
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors resize-none"
                                                placeholder="Ej: Depto 4B, Piso 2, Timbre 10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Options */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Opciones de Envío</h2>
                                </div>

                                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <p className="font-medium">Correo Argentino</p>
                                            <p className="text-sm text-[hsl(var(--text-secondary))]">Envío estándar a todo el país</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Método de Pago</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* MercadoPago Option */}
                                    <div
                                        onClick={() => setPaymentMethod('mercadopago')}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'mercadopago'
                                            ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                            : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--accent-primary))]/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="mercadopago"
                                                checked={paymentMethod === 'mercadopago'}
                                                onChange={() => setPaymentMethod('mercadopago')}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">MercadoPago</p>
                                                <p className="text-sm text-[hsl(var(--text-secondary))]">Pago online seguro</p>
                                            </div>
                                            <CreditCard className="w-6 h-6 text-[hsl(var(--accent-primary))]" />
                                        </div>
                                    </div>

                                    {/* Transferencia Option */}
                                    <div
                                        onClick={() => setPaymentMethod('transferencia')}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'transferencia'
                                            ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                            : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--accent-primary))]/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="transferencia"
                                                checked={paymentMethod === 'transferencia'}
                                                onChange={() => setPaymentMethod('transferencia')}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">Transferencia Bancaria</p>
                                                <p className="text-sm text-[hsl(var(--text-secondary))]">Realizá la transferencia y subí el comprobante</p>
                                            </div>
                                            <FileText className="w-6 h-6 text-[hsl(var(--accent-primary))]" />
                                        </div>
                                    </div>

                                    {/* Bank Details for Transferencia */}
                                    {paymentMethod === 'transferencia' && (
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))]">
                                                <p className="text-sm font-semibold mb-3 text-[hsl(var(--accent-primary))]">Datos para Transferencia</p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">Titular:</span>
                                                        <span className="font-medium">Bartolome Ferreyra</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">CUIT/CUIL:</span>
                                                        <span className="font-medium font-mono">20-37260801-4</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">Banco:</span>
                                                        <span className="font-medium">Santander</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">Número Cuenta:</span>
                                                        <span className="font-medium font-mono">156-249043/2</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">CBU:</span>
                                                        <span className="font-medium font-mono text-xs">0720156788000024904322</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">Alias:</span>
                                                        <span className="font-medium">bartu.ferreyra</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-lg bg-[hsl(var(--bg-tertiary))]">
                                                <p className="text-sm font-medium mb-3">Subir Comprobante de Pago *</p>
                                                <ReceiptUpload
                                                    selectedFile={receiptFile}
                                                    onFileSelect={setReceiptFile}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        {paymentMethod === 'mercadopago' ? 'Pagar con MercadoPago' : 'Finalizar Pedido'}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-6">
                            <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>

                            <div className="space-y-3 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-[hsl(var(--bg-tertiary))] overflow-hidden flex-shrink-0">
                                            {item.imageUrl && (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-[hsl(var(--text-secondary))]">
                                                Cantidad: {item.quantity}
                                            </p>
                                            <p className="text-sm font-bold">{formatARS(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[hsl(var(--border-color))] pt-4 space-y-2">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="gradient-text">{formatARS(cartTotal)}</span>
                                </div>
                                <p className="text-xs text-[hsl(var(--text-secondary))] mt-2">Envío sin cargo por Correo Argentino</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail, Phone, MapPin, CreditCard, ArrowLeft, Loader2, Truck, Building2 } from 'lucide-react';
import Image from 'next/image';
import { getShippingTypeLabel, getShippingTypeDescription, SHIPPING_TYPES } from '@/lib/shipping-utils';
import { OrderTimeline } from '@/components/orders/OrderTimeline';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        imageUrl: string | null;
    };
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingProvince: string;
    shippingZip: string;
    shippingDetails: string | null;
    shippingType: string | null;
    shippingMethod: string;
    shippingCost: number;
    trackingUrl: string | null;
    isFreeShipping: boolean;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
}

export default function OrderConfirmationPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const orderId = params.id as string;
    const isSuccess = searchParams.get('success') === 'true';

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${orderId}`);

                if (!response.ok) {
                    throw new Error('No se pudo cargar el pedido');
                }

                const data = await response.json();
                setOrder(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent-primary))]" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Pedido no encontrado</h1>
                    <p className="text-[hsl(var(--text-secondary))] mb-6">
                        {error || 'No pudimos encontrar este pedido'}
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success Banner */}
                {isSuccess && (
                    <div className="glass-card p-8 mb-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
                        <p className="text-[hsl(var(--text-secondary))] mb-4">
                            Gracias por tu compra. Hemos recibido tu pedido correctamente.
                        </p>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                            Número de pedido: <span className="font-mono font-medium">{order.id}</span>
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Timeline */}
                        <OrderTimeline currentStatus={order.status as any} trackingUrl={order.trackingUrl} />

                        {/* Products */}
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Productos
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-[hsl(var(--border-color))] last:border-0 last:pb-0">
                                        <div className="w-20 h-20 rounded-lg bg-[hsl(var(--bg-tertiary))] overflow-hidden flex-shrink-0">
                                            {item.product.imageUrl && (
                                                <Image
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-[hsl(var(--text-secondary))]">
                                                Cantidad: {item.quantity}
                                            </p>
                                            <p className="text-sm font-bold mt-1">
                                                ${Number(item.price * item.quantity).toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-[hsl(var(--border-color))] space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[hsl(var(--text-secondary))]">Subtotal</span>
                                    <span>${(Number(order.total) - Number(order.shippingCost)).toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[hsl(var(--text-secondary))]">Envío</span>
                                    <span>{Number(order.shippingCost) === 0 ? 'Gratis' : `$${Number(order.shippingCost).toLocaleString('es-AR')}`}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[hsl(var(--border-color))]">
                                    <span>Total</span>
                                    <span className="gradient-text">${Number(order.total).toLocaleString('es-AR')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        {order.paymentMethod === 'transferencia' && order.paymentStatus === 'PENDING' && (
                            <div className="glass-card p-6 bg-blue-500/5 border-blue-500/20">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-blue-400" />
                                    Próximos Pasos
                                </h3>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-3">
                                    Hemos recibido tu comprobante de pago. Lo verificaremos en las próximas horas y te enviaremos un email de confirmación.
                                </p>
                                <p className="text-sm text-[hsl(var(--text-secondary))]">
                                    Una vez confirmado el pago, prepararemos tu pedido para el envío.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Información de Contacto
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-[hsl(var(--text-secondary))] text-xs mb-1">Nombre</p>
                                    <p className="font-medium">{order.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-[hsl(var(--text-secondary))] text-xs mb-1">Email</p>
                                    <p>{order.customerEmail}</p>
                                </div>
                                <div>
                                    <p className="text-[hsl(var(--text-secondary))] text-xs mb-1">Teléfono</p>
                                    <p>{order.customerPhone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Dirección de Envío
                            </h3>
                            <div className="text-sm space-y-1">
                                {order.shippingType === SHIPPING_TYPES.PICKUP ? (
                                    <div>
                                        <p className="font-medium text-green-400">Retiro en Tienda</p>
                                        <p className="text-xs text-[hsl(var(--text-secondary))] mt-2">Dirección de retiro:</p>
                                        <p className="text-sm">Dirección de la tienda</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-medium">{order.shippingAddress}</p>
                                        <p>{order.shippingCity}, {order.shippingProvince}</p>
                                        <p>CP: {order.shippingZip}</p>
                                        {order.shippingDetails && (
                                            <p className="text-[hsl(var(--text-secondary))] italic">{order.shippingDetails}</p>
                                        )}
                                    </>
                                )}
                                <div className="pt-3 mt-3 border-t border-[hsl(var(--border-color))] space-y-2">
                                    <div>
                                        <p className="text-xs text-[hsl(var(--text-secondary))]">Tipo de envío</p>
                                        <p className="font-medium">{getShippingTypeLabel(order.shippingType || 'STANDARD')}</p>
                                        <p className="text-xs text-[hsl(var(--text-secondary))] mt-1">
                                            {getShippingTypeDescription(order.shippingType || 'STANDARD')}
                                        </p>
                                    </div>
                                    {order.isFreeShipping && order.shippingType !== SHIPPING_TYPES.PICKUP && (
                                        <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                                            <p className="text-xs text-green-400 font-medium">✓ Envío gratis - Santa Fe Capital/Costa</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Pago
                            </h3>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[hsl(var(--text-secondary))]">Método</span>
                                    <span className="font-medium capitalize">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[hsl(var(--text-secondary))]">Estado</span>
                                    <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-400' :
                                        order.paymentStatus === 'PENDING' ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                        {order.paymentStatus === 'PAID' ? 'Pagado' :
                                            order.paymentStatus === 'PENDING' ? 'Pendiente' :
                                                'Rechazado'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <Link href="/" className="btn btn-primary w-full flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

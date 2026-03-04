import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Package, User, MapPin, Phone, Mail, CreditCard,
    FileText, Truck, Hash, Calendar, Clock, CheckCircle2, XCircle,
    AlertCircle, Copy, ExternalLink, ShoppingBag
} from "lucide-react";
import { OrderStatusSelector } from "../_components/OrderStatusSelector";
import { TrackingUrlEditor } from "../_components/TrackingUrlEditor";
import Image from "next/image";

interface Props {
    params: Promise<{ id: string }>;
}

const PAYMENT_STATUS: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    PAID: { label: 'Pagado', color: 'text-green-400', icon: CheckCircle2 },
    PENDING: { label: 'Pendiente', color: 'text-yellow-400', icon: AlertCircle },
    CANCELLED: { label: 'Cancelado', color: 'text-red-400', icon: XCircle },
};

const SHIPPING_TYPE: Record<string, string> = {
    STANDARD: 'Envío Estándar',
    EXPRESS: 'Envío Express',
    PICKUP: 'Retiro en Local',
};

function InfoRow({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex justify-between items-start gap-4 py-2 border-b border-white/5 last:border-0">
            <span className="text-xs text-[hsl(var(--text-secondary))] shrink-0">{label}</span>
            <span className={`text-xs text-right break-all ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
        </div>
    );
}

function SectionCard({ title, icon: Icon, children, accent = false }: {
    title: string;
    icon: typeof Package;
    children: React.ReactNode;
    accent?: boolean;
}) {
    return (
        <div className="bg-[hsl(var(--bg-secondary))] border border-white/10 rounded-xl overflow-hidden">
            <div className={`flex items-center gap-2 px-5 py-4 border-b border-white/10 ${accent ? 'bg-gradient-to-r from-[hsl(var(--accent-primary))]/10 to-transparent' : ''}`}>
                <Icon size={17} className={accent ? 'text-[hsl(var(--accent-primary))]' : 'text-[hsl(var(--text-secondary))]'} />
                <h3 className="font-semibold text-sm">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

export default async function OrderDetailPage({ params }: Props) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            items: { include: { product: true } },
            shipment: true,
        }
    });

    if (!order) notFound();

    const createdAt = new Date(order.createdAt);
    const updatedAt = new Date(order.updatedAt);
    const payStatus = order.paymentStatus || 'PENDING';
    const PayIcon = PAYMENT_STATUS[payStatus]?.icon || AlertCircle;
    const isMpPayment = order.paymentMethod === 'mercadopago';
    const mpPaymentId = order.paymentReceiptUrl?.startsWith('MP_ID:')
        ? order.paymentReceiptUrl.replace('MP_ID:', '')
        : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors">
                        <ArrowLeft size={14} /> Volver a Pedidos
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag size={22} className="text-[hsl(var(--accent-primary))]" />
                        Pedido
                    </h1>
                    {/* Full ID — selectable and copyable */}
                    <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg select-all break-all">
                            {order.id}
                        </code>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-[hsl(var(--text-secondary))]">Estado del Pedido</span>
                        <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ─── Main Column ─── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Order Items */}
                    <SectionCard title="Productos del Pedido" icon={Package} accent>
                        <div className="space-y-4">
                            {order.items.map((item) => {
                                const productName = item.product?.name || item.productName || 'Producto eliminado';
                                const sku = item.product?.sku || item.productSku || 'N/A';
                                const imageUrl = item.product?.imageUrl || item.productImage;
                                const unitPrice = Number(item.price);
                                const totalPrice = unitPrice * item.quantity;

                                return (
                                    <div key={item.id} className="flex items-start gap-4 py-4 border-b border-white/5 last:border-0 last:pb-0">
                                        {/* Image */}
                                        <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={productName}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm leading-tight">{productName}</p>
                                            <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5">SKU: {sku}</p>
                                            {item.product?.id && (
                                                <Link href={`/admin/products/${item.product.id}/edit`} className="text-xs text-[hsl(var(--accent-primary))] hover:underline flex items-center gap-1 mt-1">
                                                    <ExternalLink size={10} /> Ver producto
                                                </Link>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div className="text-right shrink-0">
                                            <p className="text-xs text-[hsl(var(--text-secondary))]">
                                                {item.quantity} × USD {unitPrice.toFixed(2)}
                                            </p>
                                            <p className="font-bold text-sm mt-1">USD {totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Totals */}
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[hsl(var(--text-secondary))]">Subtotal</span>
                                <span>USD {(Number(order.total) - Number(order.shippingCost || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[hsl(var(--text-secondary))]">Envío</span>
                                <span>{Number(order.shippingCost || 0) === 0 ? '—' : `USD ${Number(order.shippingCost).toFixed(2)}`}</span>
                            </div>
                            {order.isFreeShipping && (
                                <div className="flex justify-between text-sm">
                                    <span></span>
                                    <span className="text-green-400 text-xs">✓ Zona de envío gratis</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                <span className="font-semibold">Total</span>
                                <span className="text-2xl font-bold text-[hsl(var(--accent-primary))]">
                                    USD {Number(order.total).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Receipt (bank transfer) */}
                    {order.paymentReceiptUrl && !order.paymentReceiptUrl.startsWith('MP_ID:') && (
                        <SectionCard title="Comprobante de Pago" icon={FileText}>
                            <a
                                href={`/api/receipts/${order.paymentReceiptUrl.split('/').pop()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                            >
                                {order.paymentReceiptUrl.endsWith('.pdf') ? (
                                    <FileText className="w-10 h-10 text-red-400 shrink-0" />
                                ) : (
                                    <Image
                                        src={`/api/receipts/${order.paymentReceiptUrl.split('/').pop()}`}
                                        alt="Comprobante"
                                        width={80}
                                        height={80}
                                        className="rounded object-cover"
                                        unoptimized
                                    />
                                )}
                                <div>
                                    <p className="font-medium text-sm">Ver comprobante</p>
                                    <p className="text-xs text-[hsl(var(--text-secondary))]">Click para abrir</p>
                                </div>
                                <ExternalLink size={14} className="ml-auto text-[hsl(var(--text-secondary))]" />
                            </a>
                        </SectionCard>
                    )}

                    {/* MP Payment ID */}
                    {mpPaymentId && (
                        <SectionCard title="Pago Mercado Pago" icon={CreditCard}>
                            <div className="space-y-2">
                                <InfoRow label="ID de Pago MP" value={mpPaymentId} mono />
                                <a
                                    href={`https://www.mercadopago.com.ar/activities/merchant`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-[hsl(var(--accent-primary))] hover:underline mt-2"
                                >
                                    <ExternalLink size={12} /> Ver en panel de Mercado Pago
                                </a>
                            </div>
                        </SectionCard>
                    )}
                </div>

                {/* ─── Sidebar ─── */}
                <div className="space-y-4">

                    {/* Metadata del pedido */}
                    <SectionCard title="Información del Pedido" icon={Hash}>
                        <div className="space-y-1">
                            <div className="mb-3">
                                <p className="text-xs text-[hsl(var(--text-secondary))] mb-1">ID Completo</p>
                                <code className="text-[11px] font-mono bg-white/5 px-2 py-1.5 rounded block break-all border border-white/10 select-all">
                                    {order.id}
                                </code>
                            </div>
                            <InfoRow
                                label="Creado"
                                value={`${createdAt.toLocaleDateString('es-AR')} a las ${createdAt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`}
                            />
                            <InfoRow
                                label="Actualizado"
                                value={`${updatedAt.toLocaleDateString('es-AR')} a las ${updatedAt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`}
                            />
                        </div>
                    </SectionCard>

                    {/* Pago */}
                    <SectionCard title="Información de Pago" icon={CreditCard}>
                        <div className="space-y-1">
                            <InfoRow label="Método" value={order.paymentMethod === 'mercadopago' ? 'Mercado Pago' : order.paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : order.paymentMethod || '—'} />
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs text-[hsl(var(--text-secondary))]">Estado</span>
                                <span className={`flex items-center gap-1 text-xs font-semibold ${PAYMENT_STATUS[payStatus]?.color || 'text-gray-400'}`}>
                                    <PayIcon size={13} />
                                    {PAYMENT_STATUS[payStatus]?.label || payStatus}
                                </span>
                            </div>
                            {mpPaymentId && <InfoRow label="ID MP" value={mpPaymentId} mono />}
                        </div>
                    </SectionCard>

                    {/* Cliente */}
                    <SectionCard title="Cliente" icon={User}>
                        <div className="space-y-1">
                            <InfoRow label="Nombre" value={order.customerName} />
                            <InfoRow label="Email" value={order.customerEmail} />
                            <InfoRow label="Teléfono" value={order.customerPhone} />
                            {order.customerPhone && (
                                <a
                                    href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-green-400 hover:underline mt-2 pt-2 border-t border-white/5"
                                >
                                    <Phone size={12} /> Abrir en WhatsApp
                                </a>
                            )}
                        </div>
                    </SectionCard>

                    {/* Dirección */}
                    <SectionCard title="Dirección de Envío" icon={MapPin}>
                        <div className="space-y-1">
                            <InfoRow label="Dirección" value={order.shippingAddress} />
                            <InfoRow label="Ciudad" value={order.shippingCity} />
                            <InfoRow label="Provincia" value={order.shippingProvince} />
                            <InfoRow label="Código Postal" value={order.shippingZip} />
                            {order.shippingDetails && (
                                <div className="mt-2 pt-2 border-t border-white/5">
                                    <p className="text-xs text-[hsl(var(--text-secondary))] mb-1">Detalles adicionales</p>
                                    <p className="text-xs italic">{order.shippingDetails}</p>
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    {/* Envío */}
                    <SectionCard title="Método de Envío" icon={Truck}>
                        <div className="space-y-1">
                            <InfoRow label="Tipo" value={SHIPPING_TYPE[order.shippingType || ''] || order.shippingType} />
                            <InfoRow label="Método" value={order.shippingMethod} />
                            <InfoRow label="Costo" value={`USD ${Number(order.shippingCost || 0).toFixed(2)}`} />
                            {order.isFreeShipping && (
                                <p className="text-xs text-green-400 mt-1">✓ Envío gratis aplicado</p>
                            )}
                        </div>
                    </SectionCard>

                    {/* Tracking URL */}
                    <TrackingUrlEditor orderId={order.id} initialUrl={order.trackingUrl} />

                    {/* Shipment info if exists */}
                    {order.shipment && (
                        <SectionCard title="Envío OCA" icon={Package}>
                            <div className="space-y-1">
                                <InfoRow label="N° Seguimiento" value={order.shipment.trackingNumber} mono />
                                <InfoRow label="Servicio" value={order.shipment.service} />
                                <InfoRow label="Estado" value={order.shipment.status} />
                                <InfoRow label="Costo" value={`$${Number(order.shipment.cost).toFixed(2)}`} />
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>
        </div>
    );
}

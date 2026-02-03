import { prisma } from '@/lib/prisma';
import { getOCATracking } from '@/app/actions/oca';
import { Package, Truck, MapPin, Calendar, DollarSign, Building2, FileText, Hash } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShipmentActions } from '../_components/ShipmentActions';

export const dynamic = 'force-dynamic';

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const shipment = await prisma.shipment.findUnique({
        where: { id },
        include: {
            order: {
                include: {
                    user: true,
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });

    if (!shipment) {
        notFound();
    }

    // Get OCA tracking info if available
    let trackingData = null;
    if (shipment.trackingNumber && shipment.carrier === 'OCA') {
        const result = await getOCATracking(shipment.trackingNumber);
        if (result.success) {
            trackingData = result.tracking;
        }
    }

    const isOCA = shipment.carrier === 'OCA';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/shipments" className="text-sm text-[hsl(var(--accent-primary))] hover:underline mb-2 inline-block">
                        ← Volver a Envíos
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Detalle del Envío</h1>
                    <div className="flex items-center gap-3">
                        <p className="text-[hsl(var(--text-secondary))]">
                            Tracking: <code className="text-sm bg-white/5 px-2 py-1 rounded">{shipment.trackingNumber || 'Pendiente'}</code>
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${shipment.carrier === 'OCA'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {shipment.carrier}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipment Info */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Información del Envío</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Servicio</p>
                                <p className="font-medium">{shipment.service}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Transportista</p>
                                <p className="font-medium">{shipment.carrier}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Costo</p>
                                <p className="font-medium">${Number(shipment.cost).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Estado</p>
                                <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-400/10 text-blue-400">
                                    {shipment.status.replace('_', ' ')}
                                </span>
                            </div>
                            {shipment.estimatedDelivery && (
                                <div>
                                    <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Entrega Estimada</p>
                                    <p className="font-medium">
                                        {new Date(shipment.estimatedDelivery).toLocaleDateString('es-AR')}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Creado</p>
                                <p className="font-medium">
                                    {new Date(shipment.createdAt).toLocaleDateString('es-AR')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* OCA Specific Info */}
                    {isOCA && (
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-orange-400" />
                                Información OCA
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {shipment.ocaOrderId && (
                                    <div>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">ID Orden OCA</p>
                                        <code className="text-sm bg-white/5 px-2 py-1 rounded">{shipment.ocaOrderId}</code>
                                    </div>
                                )}
                                {shipment.ocaOperativa && (
                                    <div>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Operativa</p>
                                        <p className="font-medium">{shipment.ocaOperativa}</p>
                                    </div>
                                )}
                                {shipment.ocaRemito && (
                                    <div>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Remito</p>
                                        <code className="text-sm bg-white/5 px-2 py-1 rounded">{shipment.ocaRemito}</code>
                                    </div>
                                )}
                                {shipment.ocaBranchName && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Sucursal de Entrega</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Building2 className="w-4 h-4 text-[hsl(var(--accent-secondary))]" />
                                            <p className="font-medium">{shipment.ocaBranchName}</p>
                                            {shipment.ocaBranchId && (
                                                <code className="text-xs bg-white/5 px-2 py-0.5 rounded">ID: {shipment.ocaBranchId}</code>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tracking History */}
                    {trackingData && (
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold mb-4">Historial de Seguimiento</h2>
                            <div className="space-y-1 mb-4">
                                <p className="text-sm text-[hsl(var(--text-secondary))]">
                                    Estado actual: <span className="font-medium text-[hsl(var(--text-primary))]">{trackingData.status}</span>
                                </p>
                                {trackingData.location && (
                                    <p className="text-sm text-[hsl(var(--text-secondary))]">
                                        Ubicación: <span className="font-medium text-[hsl(var(--text-primary))]">{trackingData.location}</span>
                                    </p>
                                )}
                                {trackingData.estimatedDelivery && (
                                    <p className="text-sm text-[hsl(var(--text-secondary))]">
                                        Entrega estimada: <span className="font-medium text-[hsl(var(--text-primary))]">{trackingData.estimatedDelivery}</span>
                                    </p>
                                )}
                            </div>

                            {trackingData.events && trackingData.events.length > 0 && (
                                <div className="space-y-4 mt-6">
                                    <h3 className="font-semibold text-sm text-[hsl(var(--text-secondary))]">Eventos</h3>
                                    {trackingData.events.map((event: any, index: number) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-[hsl(var(--accent-primary))]" />
                                                {index < trackingData.events.length - 1 && (
                                                    <div className="w-0.5 flex-1 bg-white/10 mt-2" style={{ minHeight: '40px' }} />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className="font-medium">{event.description || event.status}</p>
                                                <p className="text-sm text-[hsl(var(--text-secondary))]">
                                                    {event.location && `${event.location} • `}
                                                    {event.timestamp ? new Date(event.timestamp).toLocaleString('es-AR') : event.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Productos del Pedido</h2>
                        <div className="space-y-3">
                            {shipment.order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                                    <div className="w-16 h-16 rounded-lg bg-[hsl(var(--bg-tertiary))] overflow-hidden">
                                        {item.product.imageUrl && (
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                                            Cantidad: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-bold">${Number(item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions */}
                    <ShipmentActions
                        shipmentId={shipment.id}
                        trackingNumber={shipment.trackingNumber}
                        carrier={shipment.carrier}
                        status={shipment.status}
                        ocaOrderId={shipment.ocaOrderId}
                    />

                    {/* Order Info */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-4">Información del Pedido</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Número de Orden</p>
                                <Link
                                    href={`/admin/orders/${shipment.order.id}`}
                                    className="text-[hsl(var(--accent-primary))] hover:underline flex items-center gap-1"
                                >
                                    #{shipment.order.id.slice(0, 8)}
                                    <Hash className="w-3 h-3" />
                                </Link>
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Cliente</p>
                                <p className="font-medium">{shipment.order.user.name}</p>
                                <p className="text-sm text-[hsl(var(--text-secondary))]">
                                    {shipment.order.user.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Total del Pedido</p>
                                <p className="text-xl font-bold gradient-text">
                                    ${Number(shipment.order.total).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {shipment.order.shippingAddress && (
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Dirección de Envío
                            </h3>
                            <div className="text-sm space-y-1">
                                <p>{shipment.order.shippingAddress}</p>
                                {shipment.order.shippingZip && (
                                    <p className="text-[hsl(var(--text-secondary))]">
                                        CP: {shipment.order.shippingZip}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

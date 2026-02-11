import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, Phone, Mail, CreditCard, FileText, Truck } from "lucide-react";
import { OrderStatusSelector } from "../_components/OrderStatusSelector";
import Image from "next/image";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailPage({ params }: Props) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            items: {
                include: { product: true }
            }
        }
    });

    if (!order) notFound();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/orders" className="flex items-center text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Volver a Pedidos
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[color:var(--text-secondary)]">Estado Actual:</span>
                    <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6 text-[color:var(--accent-primary)]">
                            <Package size={20} />
                            <h2 className="text-lg font-bold">Productos del Pedido</h2>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[color:var(--border-color)] last:border-0 last:pb-0">
                                    <div className="w-20 h-20 bg-[color:var(--bg-tertiary)] rounded-md overflow-hidden flex-shrink-0">
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
                                        <p className="text-sm text-[color:var(--text-secondary)]">SKU: {item.product.sku}</p>
                                        <p className="text-sm text-[color:var(--text-secondary)]">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">${Number(item.price).toFixed(2)}</p>
                                        <p className="text-sm text-[color:var(--text-secondary)]">
                                            Total: ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-[color:var(--border-color)] space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[color:var(--text-secondary)]">Subtotal</span>
                                <span>${(Number(order.total) - Number(order.shippingCost)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[color:var(--text-secondary)]">Envío</span>
                                <span>${Number(order.shippingCost).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-[color:var(--border-color)]">
                                <span className="font-medium">Total</span>
                                <span className="text-2xl font-bold text-[color:var(--accent-primary)]">${Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Receipt */}
                    {order.paymentReceiptUrl && (
                        <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4 text-[color:var(--accent-primary)]">
                                <FileText size={20} />
                                <h2 className="text-lg font-bold">Comprobante de Pago</h2>
                            </div>
                            <div className="bg-[color:var(--bg-tertiary)] rounded-lg p-4">
                                <a
                                    href={order.paymentReceiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 hover:text-[color:var(--accent-primary)] transition-colors"
                                >
                                    {order.paymentReceiptUrl.endsWith('.pdf') ? (
                                        <FileText className="w-12 h-12 text-[color:var(--text-secondary)]" />
                                    ) : (
                                        <Image
                                            src={order.paymentReceiptUrl}
                                            alt="Comprobante"
                                            width={200}
                                            height={200}
                                            className="rounded"
                                            unoptimized
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">Ver comprobante</p>
                                        <p className="text-sm text-[color:var(--text-secondary)]">Click para abrir</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-[color:var(--text-secondary)]">
                            <User size={18} />
                            <h3 className="font-semibold">Información del Cliente</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-[color:var(--text-secondary)] mb-1">Nombre</p>
                                <p className="font-medium">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[color:var(--text-secondary)] mb-1 flex items-center gap-1">
                                    <Mail size={12} /> Email
                                </p>
                                <p className="text-sm">{order.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[color:var(--text-secondary)] mb-1 flex items-center gap-1">
                                    <Phone size={12} /> Teléfono
                                </p>
                                <p className="text-sm font-medium">{order.customerPhone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-[color:var(--text-secondary)]">
                            <MapPin size={18} />
                            <h3 className="font-semibold">Dirección de Envío</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium">{order.shippingAddress}</p>
                            <p>{order.shippingCity}, {order.shippingProvince}</p>
                            <p>CP: {order.shippingZip}</p>
                            {order.shippingDetails && (
                                <p className="text-[color:var(--text-secondary)] italic">{order.shippingDetails}</p>
                            )}
                        </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-[color:var(--text-secondary)]">
                            <Truck size={18} />
                            <h3 className="font-semibold">Método de Envío</h3>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                            <Truck className="w-5 h-5 text-blue-400" />
                            <div>
                                <p className="font-medium">{order.shippingMethod}</p>
                                <p className="text-xs text-[color:var(--text-secondary)]">
                                    Costo: ${Number(order.shippingCost).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-[color:var(--text-secondary)]">
                            <CreditCard size={18} />
                            <h3 className="font-semibold">Información de Pago</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[color:var(--text-secondary)]">Método</span>
                                <span className="font-medium capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[color:var(--text-secondary)]">Estado</span>
                                <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-400' :
                                    order.paymentStatus === 'PENDING' ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Metadata */}
                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <h3 className="font-semibold mb-3 text-sm">Información del Pedido</h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[color:var(--text-secondary)]">ID</span>
                                <span className="font-mono">{order.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[color:var(--text-secondary)]">Creado</span>
                                <span>{new Date(order.createdAt).toLocaleDateString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[color:var(--text-secondary)]">Actualizado</span>
                                <span>{new Date(order.updatedAt).toLocaleDateString('es-AR')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";
import { OrderStatusSelector } from "../_components/OrderStatusSelector";

interface Props {
    params: {
        id: string;
    };
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6 text-[color:var(--accent-primary)]">
                            <Package size={20} />
                            <h2 className="text-lg font-bold">Items del Pedido</h2>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[color:var(--border-color)] last:border-0 last:pb-0">
                                    <div className="w-16 h-16 bg-[color:var(--bg-tertiary)] rounded-md overflow-hidden flex-shrink-0">
                                        {item.product.imageUrl && (
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-[color:var(--text-secondary)]">Cantidad: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold">${Number(item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-[color:var(--border-color)] flex justify-between items-center">
                            <span className="text-[color:var(--text-secondary)]">Total Pagado</span>
                            <span className="text-2xl font-bold text-[color:var(--accent-primary)]">${Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Info Side */}
                <div className="space-y-6">
                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-[color:var(--text-secondary)]">
                            <User size={18} />
                            <h3 className="font-semibold">Cliente</h3>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium">{order.user?.name || "Invitado"}</p>
                            <p className="text-sm text-[color:var(--text-secondary)]">{order.user?.email}</p>
                            <p className="text-xs text-[color:var(--text-tertiary)] mt-2">ID: {order.userId}</p>
                        </div>
                    </div>

                    <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-[color:var(--text-secondary)]">
                            <MapPin size={18} />
                            <h3 className="font-semibold">Envío</h3>
                        </div>
                        <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                            {/* Placeholder for shipping address */}
                            Dirección de prueba 123<br />
                            Ciudad Autónoma de Buenos Aires<br />
                            CP 1414, Argentina
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Phone, CreditCard, Clock, Package } from "lucide-react";
import { OrderStatusSelector } from "./_components/OrderStatusSelector";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { formatDate, formatTime } from "@/lib/date-utils";

export const dynamic = 'force-dynamic';

const PAYMENT_STATUS_STYLES: Record<string, string> = {
    PAID: 'bg-green-500/20 text-green-400 border-green-500/30',
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
    PAID: 'Pagado',
    PENDING: 'Pendiente',
    CANCELLED: 'Cancelado',
};

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
    });

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Pedidos"
                description={`${orders.length} pedido${orders.length !== 1 ? 's' : ''} en total`}
            />

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
                            <tr>
                                <th className="h-12 px-4 font-medium align-middle whitespace-nowrap">ID Pedido</th>
                                <th className="h-12 px-4 font-medium align-middle">Cliente</th>
                                <th className="h-12 px-4 font-medium align-middle whitespace-nowrap">Teléfono</th>
                                <th className="h-12 px-4 font-medium align-middle whitespace-nowrap">Fecha</th>
                                <th className="h-12 px-4 font-medium align-middle whitespace-nowrap">Items</th>
                                <th className="h-12 px-4 font-medium align-middle whitespace-nowrap">Pago</th>
                                <th className="h-12 px-4 font-medium align-middle whitespace-nowrap">Total</th>
                                <th className="h-12 px-4 font-medium align-middle text-center whitespace-nowrap">Estado</th>
                                <th className="h-12 px-4 font-medium align-middle text-right">Ver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-12 text-center text-[color:var(--text-secondary)]">
                                        <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p>No hay pedidos registrados aún.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const payStatus = order.paymentStatus || 'PENDING';
                                    const date = new Date(order.createdAt);
                                    return (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            {/* ID — full, selectable */}
                                            <td className="p-4">
                                                <span className="font-mono text-xs bg-white/5 px-2 py-1 rounded select-all tracking-tight">
                                                    {order.id}
                                                </span>
                                            </td>

                                            {/* Cliente */}
                                            <td className="p-4 min-w-[160px]">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{order.customerName || '—'}</span>
                                                    <span className="text-xs text-[hsl(var(--text-secondary))] truncate max-w-[200px]">
                                                        {order.customerEmail || '—'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Teléfono */}
                                            <td className="p-4">
                                                {order.customerPhone ? (
                                                    <a
                                                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-xs hover:text-green-400 hover:underline transition-colors"
                                                    >
                                                        <Phone size={11} />
                                                        {order.customerPhone}
                                                    </a>
                                                ) : (
                                                    <span className="text-[hsl(var(--text-secondary))] text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Fecha con hora */}
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex flex-col text-xs">
                                                    <span>{formatDate(order.createdAt)}</span>
                                                    <span className="text-[hsl(var(--text-secondary))] flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {formatTime(order.createdAt)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Cantidad de items */}
                                            <td className="p-4 text-center text-xs">
                                                <span className="bg-white/10 rounded px-2 py-0.5">
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </span>
                                            </td>

                                            {/* Método + estado de pago */}
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <CreditCard size={11} className="text-[color:var(--text-secondary)]" />
                                                        <span className="capitalize">{order.paymentMethod || '—'}</span>
                                                    </div>
                                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border w-fit ${PAYMENT_STATUS_STYLES[payStatus] || PAYMENT_STATUS_STYLES.PENDING}`}>
                                                        {PAYMENT_STATUS_LABELS[payStatus] || payStatus}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Total */}
                                            <td className="p-4 font-bold whitespace-nowrap">
                                                USD {Number(order.total).toFixed(2)}
                                            </td>

                                            {/* Estado de orden */}
                                            <td className="p-4 text-center">
                                                <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                                            </td>

                                            {/* Ver detalle */}
                                            <td className="p-4 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-[hsl(var(--accent-primary))]/20 hover:text-[hsl(var(--accent-primary))] transition-all border border-white/10"
                                                >
                                                    <Eye size={13} />
                                                    Ver
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

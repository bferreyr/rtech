import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Phone, CreditCard } from "lucide-react";
import { OrderStatusSelector } from "./_components/OrderStatusSelector";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true }
    });

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Pedidos"
                description="Gestión de órdenes y envíos."
            />

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
                            <tr>
                                <th className="h-12 px-4 font-medium align-middle">ID Pedido</th>
                                <th className="h-12 px-4 font-medium align-middle">Cliente</th>
                                <th className="h-12 px-4 font-medium align-middle">Teléfono</th>
                                <th className="h-12 px-4 font-medium align-middle">Fecha</th>
                                <th className="h-12 px-4 font-medium align-middle">Pago</th>
                                <th className="h-12 px-4 font-medium align-middle">Total</th>
                                <th className="h-12 px-4 font-medium align-middle text-center">Estado</th>
                                <th className="h-12 px-4 font-medium align-middle text-right">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-[color:var(--text-secondary)]">
                                        No hay pedidos registrados aún.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-xs">{order.id}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.customerName}</span>
                                                <span className="text-xs text-[hsl(var(--text-secondary))]">{order.customerEmail}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Phone size={12} className="text-[hsl(var(--text-secondary))]" />
                                                {order.customerPhone ? (
                                                    <a
                                                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-green-400 hover:underline"
                                                    >
                                                        {order.customerPhone}
                                                    </a>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-[hsl(var(--text-secondary))]">
                                            {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <CreditCard size={14} className="text-[color:var(--text-secondary)]" />
                                                <span className="text-xs capitalize">{order.paymentMethod}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold">
                                            ${Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/orders/${order.id}`} className="inline-flex p-2 hover:text-[color:var(--accent-primary)] transition-colors">
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

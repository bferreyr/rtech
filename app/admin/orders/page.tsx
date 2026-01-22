import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";
import { OrderStatusSelector } from "./_components/OrderStatusSelector";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pedidos</h1>
                <p className="text-[color:var(--text-secondary)]">Gestión de órdenes y envíos.</p>
            </div>

            <div className="rounded-lg border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[color:var(--bg-tertiary)] border-b border-[color:var(--border-color)]">
                        <tr>
                            <th className="h-12 px-4 font-medium align-middle">ID Pedido</th>
                            <th className="h-12 px-4 font-medium align-middle">Cliente</th>
                            <th className="h-12 px-4 font-medium align-middle">Fecha</th>
                            <th className="h-12 px-4 font-medium align-middle">Total</th>
                            <th className="h-12 px-4 font-medium align-middle text-center">Estado</th>
                            <th className="h-12 px-4 font-medium align-middle text-right">Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-[color:var(--text-secondary)]">
                                    No hay pedidos registrados aún.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="border-b border-[color:var(--border-color)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors">
                                    <td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.user?.name || 'Invitado'}</span>
                                            <span className="text-xs text-[color:var(--text-secondary)]">{order.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[color:var(--text-secondary)]">
                                        {new Date(order.createdAt).toLocaleDateString()}
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
    );
}

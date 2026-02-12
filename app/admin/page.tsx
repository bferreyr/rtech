import { prisma } from "@/lib/prisma";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";

export const dynamic = 'force-dynamic';

async function getStats() {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    // Sum total Revenue
    const orders = await prisma.order.findMany({
        select: { total: true },
        where: { status: 'PAID' } // Assuming only PAID orders count as revenue
    });

    const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);

    return { totalProducts, totalOrders, totalRevenue };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <AdminHeader
                title="Panel de Control"
                description="Visión general del estado de tu tienda."
            />

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Ingresos Totales"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    gradient="green"
                />
                <StatCard
                    title="Pedidos Totales"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    gradient="blue"
                />
                <StatCard
                    title="Productos en Catálogo"
                    value={stats.totalProducts}
                    icon={Package}
                    gradient="purple"
                />
            </div>

            {/* Recent Activity Section Placeholder */}
            <AdminCard hover={false}>
                <div className="min-h-[300px] flex items-center justify-center text-[hsl(var(--text-tertiary))]">
                    <div className="text-center">
                        <TrendingUp className="mx-auto mb-4 opacity-50" size={48} />
                        <p>Aquí se mostrará el gráfico de ventas mensuales.</p>
                        <p className="text-sm">(Requiere historial de ventas real)</p>
                    </div>
                </div>
            </AdminCard>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

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

function StatCard({ title, value, icon: Icon, colorClass }: any) {
    return (
        <div className="card flex items-center p-6 space-x-4">
            <div className={`p-4 rounded-full ${colorClass} bg-opacity-20`}>
                <Icon size={24} className={colorClass.replace("bg-", "text-")} />
            </div>
            <div>
                <p className="text-sm text-[color:var(--text-secondary)] font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
            </div>
        </div>
    );
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Panel de Control</h1>
                <p className="text-[color:var(--text-secondary)]">Visión general del estado de tu tienda.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Ingresos Totales"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-green-500 text-green-500"
                />
                <StatCard
                    title="Pedidos Totales"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    colorClass="bg-blue-500 text-blue-500"
                />
                <StatCard
                    title="Productos en Catálogo"
                    value={stats.totalProducts}
                    icon={Package}
                    colorClass="bg-purple-500 text-purple-500"
                />
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="card min-h-[300px] flex items-center justify-center text-[color:var(--text-tertiary)] bg-[color:var(--bg-secondary)]">
                <div className="text-center">
                    <TrendingUp className="mx-auto mb-4 opacity-50" size={48} />
                    <p>Aquí se mostrará el gráfico de ventas mensuales.</p>
                    <p className="text-sm">(Requiere historial de ventas real)</p>
                </div>
            </div>
        </div>
    );
}

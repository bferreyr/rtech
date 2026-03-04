import { prisma } from "@/lib/prisma";
import dynamicImport from "next/dynamic";
import {
    DollarSign, Package, ShoppingCart, TrendingUp,
    AlertCircle, Clock, CheckCircle2, XCircle,
    Users, CreditCard, BarChart3, Star
} from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";
import Link from "next/link";

export const dynamic = 'force-dynamic';

// Dynamic imports — charts are client components
const RevenueChart = dynamicImport(() => import('@/components/admin/charts/RevenueChart').then(m => m.RevenueChart), { ssr: false });
const OrderStatusChart = dynamicImport(() => import('@/components/admin/charts/OrderStatusChart').then(m => m.OrderStatusChart), { ssr: false });
const TopProductsChart = dynamicImport(() => import('@/components/admin/charts/TopProductsChart').then(m => m.TopProductsChart), { ssr: false });
const PaymentMethodChart = dynamicImport(() => import('@/components/admin/charts/PaymentMethodChart').then(m => m.PaymentMethodChart), { ssr: false });

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getDashboardData() {
    const now = new Date();
    const startOf30Days = new Date(now);
    startOf30Days.setDate(now.getDate() - 29);

    const [
        allOrders,
        totalProducts,
        recentOrders,
        orderItems,
        lowStockProducts,
        pendingOrders,
        paidOrders,
    ] = await Promise.all([
        prisma.order.findMany({
            select: {
                id: true, total: true, status: true, paymentStatus: true,
                paymentMethod: true, createdAt: true,
                customerName: true, customerEmail: true, customerPhone: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count(),
        prisma.order.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, customerName: true, customerEmail: true,
                customerPhone: true, total: true, status: true,
                paymentStatus: true, paymentMethod: true, createdAt: true,
            },
        }),
        prisma.orderItem.findMany({
            select: { productId: true, quantity: true, price: true, productName: true, product: { select: { name: true } } },
        }),
        prisma.product.findMany({
            where: { stock: { lte: 5 } },
            select: { id: true, name: true, stock: true, sku: true },
            orderBy: { stock: 'asc' },
            take: 8,
        }),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    ]);

    // KPIs
    const totalRevenue = allOrders
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((acc, o) => acc + Number(o.total), 0);

    const thisMonth = allOrders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthRevenue = thisMonth
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((acc, o) => acc + Number(o.total), 0);

    // Revenue by month (last 12 months)
    const months: Record<string, { revenue: number; orders: number }> = {};
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
        months[key] = { revenue: 0, orders: 0 };
    }
    allOrders.forEach(o => {
        const d = new Date(o.createdAt);
        const key = d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
        if (key in months) {
            months[key].orders += 1;
            if (o.paymentStatus === 'PAID') months[key].revenue += Number(o.total);
        }
    });
    const revenueData = Object.entries(months).map(([month, v]) => ({ month, ...v }));

    // Order status distribution
    const statusCount: Record<string, number> = {};
    allOrders.forEach(o => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });
    const STATUS_COLORS: Record<string, string> = {
        PENDING: '#f59e0b',
        PAID: '#10b981',
        SHIPPED: '#3b82f6',
        DELIVERED: '#8b5cf6',
        CANCELLED: '#ef4444',
    };
    const STATUS_LABELS: Record<string, string> = {
        PENDING: 'Pendiente', PAID: 'Pagado', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
    };
    const orderStatusData = Object.entries(statusCount).map(([status, value]) => ({
        name: STATUS_LABELS[status] || status,
        value,
        color: STATUS_COLORS[status] || '#888',
    }));

    // Top products by units sold
    const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};
    orderItems.forEach(item => {
        const id = item.productId || 'unknown';
        const name = item.product?.name || item.productName || 'Desconocido';
        if (!productSales[id]) productSales[id] = { name, sold: 0, revenue: 0 };
        productSales[id].sold += item.quantity;
        productSales[id].revenue += Number(item.price) * item.quantity;
    });
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 8);

    // Payment methods
    const paymentData: Record<string, { count: number; revenue: number }> = {};
    allOrders.forEach(o => {
        const m = o.paymentMethod || 'otro';
        if (!paymentData[m]) paymentData[m] = { count: 0, revenue: 0 };
        paymentData[m].count += 1;
        if (o.paymentStatus === 'PAID') paymentData[m].revenue += Number(o.total);
    });
    const paymentMethodData = Object.entries(paymentData).map(([method, v]) => ({
        method: method === 'mercadopago' ? 'MercadoPago' : method === 'transferencia' ? 'Transferencia' : method,
        ...v,
    }));

    // Unique customers
    const uniqueEmails = new Set(allOrders.map(o => o.customerEmail).filter(Boolean));

    return {
        totalRevenue, monthRevenue,
        totalOrders: allOrders.length,
        totalProducts,
        pendingOrders,
        uniqueCustomers: uniqueEmails.size,
        revenueData,
        orderStatusData,
        topProducts,
        paymentMethodData,
        recentOrders,
        lowStockProducts,
    };
}

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        PENDING: 'bg-yellow-500/20 text-yellow-400',
        PAID: 'bg-green-500/20 text-green-400',
        SHIPPED: 'bg-blue-500/20 text-blue-400',
        DELIVERED: 'bg-purple-500/20 text-purple-400',
        CANCELLED: 'bg-red-500/20 text-red-400',
    };
    const labels: Record<string, string> = {
        PENDING: 'Pendiente', PAID: 'Pagado', SHIPPED: 'Enviado',
        DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
    };
    return (
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${map[status] || 'bg-white/10 text-white'}`}>
            {labels[status] || status}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
    const data = await getDashboardData();
    const now = new Date();

    return (
        <div className="space-y-8">
            <AdminHeader
                title="Panel de Control"
                description={`Última actualización: ${now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`}
            />

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Ingresos Totales"
                    value={`USD ${data.totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    icon={DollarSign}
                    gradient="green"
                />
                <StatCard
                    title="Ingresos Este Mes"
                    value={`USD ${data.monthRevenue.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    icon={TrendingUp}
                    gradient="purple"
                />
                <StatCard
                    title="Pedidos Totales"
                    value={data.totalOrders}
                    icon={ShoppingCart}
                    gradient="blue"
                />
                <StatCard
                    title="Clientes Únicos"
                    value={data.uniqueCustomers}
                    icon={Users}
                    gradient="orange"
                />
            </div>

            {/* ── Alerts row ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pending orders alert */}
                <Link href="/admin/orders" className="group glass-card p-5 flex items-center gap-4 hover:border-yellow-500/40 transition-colors border border-transparent">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/15 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-yellow-400">{data.pendingOrders}</p>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">Pedidos pendientes</p>
                    </div>
                </Link>

                {/* Low stock alert */}
                <Link href="/admin/products" className="group glass-card p-5 flex items-center gap-4 hover:border-red-500/40 transition-colors border border-transparent">
                    <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-400">{data.lowStockProducts.length}</p>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">Productos con stock bajo (≤5)</p>
                    </div>
                </Link>

                {/* Catalog size */}
                <Link href="/admin/products" className="group glass-card p-5 flex items-center gap-4 hover:border-blue-500/40 transition-colors border border-transparent">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-400">{data.totalProducts}</p>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">Productos en catálogo</p>
                    </div>
                </Link>
            </div>

            {/* ── Revenue + Orders chart ── */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={18} className="text-[hsl(var(--accent-primary))]" />
                    <h2 className="font-bold text-lg">Ingresos y Pedidos — Últimos 12 meses</h2>
                </div>
                <p className="text-xs text-[hsl(var(--text-secondary))] mb-6">
                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Ingresos USD (eje izq.)</span>
                    <span className="ml-4 inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Pedidos (eje der.)</span>
                </p>
                <RevenueChart data={data.revenueData} />
            </div>

            {/* ── Status donut + Payment methods ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 size={18} className="text-[hsl(var(--accent-primary))]" />
                        <h2 className="font-bold">Estado de Pedidos</h2>
                    </div>
                    <OrderStatusChart data={data.orderStatusData} />
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <CreditCard size={18} className="text-[hsl(var(--accent-primary))]" />
                        <h2 className="font-bold">Métodos de Pago</h2>
                    </div>
                    <p className="text-xs text-[hsl(var(--text-secondary))] mb-4">
                        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Cantidad</span>
                        <span className="ml-3 inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Ingresos USD</span>
                    </p>
                    <PaymentMethodChart data={data.paymentMethodData} />
                </div>
            </div>

            {/* ── Top products + Low stock ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Star size={18} className="text-[hsl(var(--accent-primary))]" />
                        <h2 className="font-bold">Productos Más Vendidos</h2>
                    </div>
                    {data.topProducts.length > 0 ? (
                        <TopProductsChart data={data.topProducts} />
                    ) : (
                        <p className="text-sm text-[hsl(var(--text-secondary))] text-center py-10">Sin ventas registradas aún</p>
                    )}
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle size={18} className="text-red-400" />
                        <h2 className="font-bold">Stock Bajo — Atención Urgente</h2>
                    </div>
                    {data.lowStockProducts.length === 0 ? (
                        <div className="flex items-center gap-2 text-green-400 py-4">
                            <CheckCircle2 size={18} />
                            <span className="text-sm">Todos los productos tienen stock suficiente</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.lowStockProducts.map(p => (
                                <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-red-500/30 group">
                                    <div>
                                        <p className="text-sm font-medium group-hover:text-red-400 transition-colors line-clamp-1">{p.name}</p>
                                        <p className="text-xs text-[hsl(var(--text-secondary))]">SKU: {p.sku}</p>
                                    </div>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${p.stock === 0 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {p.stock === 0 ? 'SIN STOCK' : `${p.stock} ud.`}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Recent orders table ── */}
            <div className="glass-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={18} className="text-[hsl(var(--accent-primary))]" />
                        <h2 className="font-bold">Últimos Pedidos</h2>
                    </div>
                    <Link href="/admin/orders" className="text-xs text-[hsl(var(--accent-primary))] hover:underline">
                        Ver todos →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-white/5">
                            <tr className="text-xs text-[hsl(var(--text-secondary))]">
                                <th className="text-left px-6 py-3 font-medium">Cliente</th>
                                <th className="text-left px-6 py-3 font-medium">Fecha</th>
                                <th className="text-left px-6 py-3 font-medium">Método</th>
                                <th className="text-left px-6 py-3 font-medium">Total</th>
                                <th className="text-left px-6 py-3 font-medium">Estado</th>
                                <th className="text-right px-6 py-3 font-medium">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentOrders.map(order => (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3">
                                        <p className="font-medium text-sm">{order.customerName || '—'}</p>
                                        <p className="text-xs text-[hsl(var(--text-secondary))] truncate max-w-[180px]">{order.customerEmail}</p>
                                    </td>
                                    <td className="px-6 py-3 text-xs text-[hsl(var(--text-secondary))] whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                    </td>
                                    <td className="px-6 py-3 text-xs capitalize">
                                        {order.paymentMethod === 'mercadopago' ? 'MercadoPago' : order.paymentMethod === 'transferencia' ? 'Transferencia' : order.paymentMethod || '—'}
                                    </td>
                                    <td className="px-6 py-3 font-bold text-sm whitespace-nowrap">
                                        USD {Number(order.total).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <Link href={`/admin/orders/${order.id}`} className="text-xs text-[hsl(var(--accent-primary))] hover:underline">
                                            Ver →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

'use client';

import dynamic from 'next/dynamic';

// All chart components loaded client-side only (ssr: false is only allowed in Client Components)
const RevenueChart = dynamic(() => import('./RevenueChart').then(m => m.RevenueChart), { ssr: false, loading: () => <ChartSkeleton height={280} /> });
const OrderStatusChart = dynamic(() => import('./OrderStatusChart').then(m => m.OrderStatusChart), { ssr: false, loading: () => <ChartSkeleton height={240} /> });
const TopProductsChart = dynamic(() => import('./TopProductsChart').then(m => m.TopProductsChart), { ssr: false, loading: () => <ChartSkeleton height={260} /> });
const PaymentMethodChart = dynamic(() => import('./PaymentMethodChart').then(m => m.PaymentMethodChart), { ssr: false, loading: () => <ChartSkeleton height={200} /> });

function ChartSkeleton({ height }: { height: number }) {
    return (
        <div
            style={{ height }}
            className="w-full rounded-lg bg-white/5 animate-pulse flex items-center justify-center"
        >
            <div className="text-xs text-white/20">Cargando gráfico…</div>
        </div>
    );
}

interface RevenueDataPoint {
    month: string;
    revenue: number;
    orders: number;
    [key: string]: any;
}

interface StatusData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

interface ProductData {
    name: string;
    sold: number;
    revenue: number;
    [key: string]: any;
}

interface PaymentData {
    method: string;
    count: number;
    revenue: number;
    [key: string]: any;
}

interface Props {
    revenueData: RevenueDataPoint[];
    orderStatusData: StatusData[];
    topProducts: ProductData[];
    paymentMethodData: PaymentData[];
}

export function DashboardCharts({ revenueData, orderStatusData, topProducts, paymentMethodData }: Props) {
    return { RevenueChart, OrderStatusChart, TopProductsChart, PaymentMethodChart };
}

// Export individual wrappers so the page can use them directly
export { RevenueChart, OrderStatusChart, TopProductsChart, PaymentMethodChart };

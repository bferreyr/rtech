'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface DataPoint {
    month: string;
    revenue: number;
    orders: number;
    [key: string]: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1a1a2e] border border-white/20 rounded-lg p-3 shadow-xl text-sm">
                <p className="font-semibold mb-2 text-white">{label}</p>
                {payload.map((p: any) => (
                    <p key={p.name} style={{ color: p.color }}>
                        {p.name === 'revenue' ? `Ingresos: USD ${Number(p.value).toFixed(0)}` : `Pedidos: ${p.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export function RevenueChart({ data }: { data: DataPoint[] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={2} fill="url(#gradRevenue)" name="revenue" dot={false} activeDot={{ r: 4, fill: '#a78bfa' }} />
                <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#60a5fa" strokeWidth={2} fill="url(#gradOrders)" name="orders" dot={false} activeDot={{ r: 4, fill: '#60a5fa' }} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

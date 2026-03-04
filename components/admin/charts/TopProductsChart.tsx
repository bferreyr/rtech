'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface ProductData {
    name: string;
    sold: number;
    revenue: number;
    [key: string]: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-[#1a1a2e] border border-white/20 rounded-lg px-3 py-2 shadow-xl text-sm">
                <p className="font-semibold text-white mb-1 max-w-[180px] truncate">{label}</p>
                <p className="text-purple-400">{payload[0].value} vendidos</p>
                {payload[1] && <p className="text-green-400">USD {Number(payload[1].value).toFixed(0)} ingresos</p>}
            </div>
        );
    }
    return null;
};

export function TopProductsChart({ data }: { data: ProductData[] }) {
    return (
        <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 10, fill: '#ccc' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.length > 18 ? v.slice(0, 18) + '…' : v}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="sold" fill="#a78bfa" radius={[0, 4, 4, 0]} name="sold" />
            </BarChart>
        </ResponsiveContainer>
    );
}

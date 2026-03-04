'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface PaymentData {
    method: string;
    count: number;
    revenue: number;
    [key: string]: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-[#1a1a2e] border border-white/20 rounded-lg px-3 py-2 shadow-xl text-sm">
                <p className="font-semibold text-white mb-1">{label}</p>
                <p className="text-blue-400">{payload[0].value} pagos</p>
                {payload[1] && <p className="text-green-400">USD {Number(payload[1].value).toFixed(0)}</p>}
            </div>
        );
    }
    return null;
};

export function PaymentMethodChart({ data }: { data: PaymentData[] }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 0, right: 10, left: -10, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="method" tick={{ fontSize: 11, fill: '#ccc' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="count" name="Cantidad" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Ingresos" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

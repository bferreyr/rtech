import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: { value: number; isPositive: boolean };
    gradient?: 'blue' | 'green' | 'purple' | 'red' | 'cyan' | 'orange';
}

export function StatCard({ title, value, icon: Icon, trend, gradient = 'blue' }: StatCardProps) {
    const gradients = {
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        purple: 'from-purple-500 to-pink-500',
        red: 'from-red-500 to-orange-500',
        cyan: 'from-cyan-500 to-blue-500',
        orange: 'from-orange-500 to-red-500',
    };

    return (
        <div className="glass-card p-6 hover:border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-[hsl(var(--text-secondary))] font-medium mb-2">{title}</p>
                    <h3 className="text-3xl font-bold mb-2">{value}</h3>
                    {trend && (
                        <div className={`text-xs flex items-center gap-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
                            <span className="text-[hsl(var(--text-tertiary))]">vs mes anterior</span>
                        </div>
                    )}
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${gradients[gradient]} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );
}

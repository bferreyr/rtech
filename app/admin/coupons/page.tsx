import { getCoupons, deleteCoupon, toggleCoupon } from "@/app/actions/coupons";
import Link from "next/link";
import { Plus, Trash2, Edit, Power, Ticket, AlertCircle, CheckCircle2, Timer } from "lucide-react";

function formatDate(date: Date | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function CouponTypeBadge({ type }: { type: 'PERCENTAGE' | 'FIXED_ARS' }) {
    if (type === 'PERCENTAGE') {
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/20">%</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-300 border border-green-500/20">ARS</span>;
}

function StatusBadge({ active, expiresAt, usedCount, maxUses }: { active: boolean; expiresAt: Date | null; usedCount: number; maxUses: number | null }) {
    const isExpired = expiresAt && new Date(expiresAt) < new Date();
    const isExhausted = maxUses !== null && usedCount >= maxUses;

    if (!active) return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <Power className="w-3 h-3" /> Inactivo
        </span>
    );
    if (isExpired) return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Timer className="w-3 h-3" /> Expirado
        </span>
    );
    if (isExhausted) return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <AlertCircle className="w-3 h-3" /> Sin usos
        </span>
    );
    return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 className="w-3 h-3" /> Activo
        </span>
    );
}

export default async function CouponsPage() {
    const coupons = await getCoupons();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Ticket className="w-8 h-8 text-[hsl(var(--accent-primary))]" />
                        Cupones de Descuento
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] mt-1">
                        Administrá los cupones de descuento disponibles en la tienda.
                    </p>
                </div>
                <Link href="/admin/coupons/new" className="btn btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Cupón
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total cupones', value: coupons.length, color: 'text-white' },
                    { label: 'Activos', value: coupons.filter(c => c.active && (!c.expiresAt || new Date(c.expiresAt) > new Date())).length, color: 'text-green-400' },
                    { label: 'Inactivos', value: coupons.filter(c => !c.active).length, color: 'text-red-400' },
                    { label: 'Usos totales', value: coupons.reduce((sum, c) => sum + c.usedCount, 0), color: 'text-[hsl(var(--accent-primary))]' },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card p-4 space-y-1">
                        <p className="text-xs text-[hsl(var(--text-tertiary))]">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Código</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Tipo</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Descuento</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Usos</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Vence</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Estado</th>
                                <th className="text-right p-4 font-medium text-[hsl(var(--text-secondary))]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-[hsl(var(--text-secondary))]">
                                            <Ticket className="w-12 h-12 opacity-30" />
                                            <p className="font-medium">No hay cupones creados.</p>
                                            <Link href="/admin/coupons/new" className="btn btn-primary text-sm">
                                                Crear el primero
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono font-bold text-[hsl(var(--accent-primary))] tracking-wider text-sm">
                                                    {coupon.code}
                                                </span>
                                                {coupon.description && (
                                                    <span className="text-xs text-[hsl(var(--text-tertiary))] mt-0.5">{coupon.description}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <CouponTypeBadge type={coupon.type} />
                                        </td>
                                        <td className="p-4 font-medium text-white">
                                            {coupon.type === 'PERCENTAGE'
                                                ? `${coupon.value}%`
                                                : `$${Number(coupon.value).toLocaleString('es-AR')}`
                                            }
                                            {coupon.minOrderAmount && (
                                                <div className="text-xs text-[hsl(var(--text-tertiary))]">
                                                    Mín: ${Number(coupon.minOrderAmount).toLocaleString('es-AR')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="font-medium">{coupon.usedCount} usados</span>
                                                <span className="text-[hsl(var(--text-tertiary))]">
                                                    {coupon.maxUses !== null ? `de ${coupon.maxUses}` : 'ilimitados'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-[hsl(var(--text-secondary))]">
                                            {formatDate(coupon.expiresAt)}
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge
                                                active={coupon.active}
                                                expiresAt={coupon.expiresAt}
                                                usedCount={coupon.usedCount}
                                                maxUses={coupon.maxUses}
                                            />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Toggle active */}
                                                <form action={async () => {
                                                    'use server';
                                                    await toggleCoupon(coupon.id, !coupon.active);
                                                }}>
                                                    <button
                                                        type="submit"
                                                        title={coupon.active ? 'Desactivar' : 'Activar'}
                                                        className={`p-2 rounded-lg transition-colors ${coupon.active
                                                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                        }`}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                </form>
                                                {/* Edit */}
                                                <Link
                                                    href={`/admin/coupons/${coupon.id}`}
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                {/* Delete */}
                                                <form action={async () => {
                                                    'use server';
                                                    await deleteCoupon(coupon.id);
                                                }}>
                                                    <button
                                                        type="submit"
                                                        title="Eliminar"
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                        onClick={(e) => {
                                                            if (!confirm(`¿Eliminar el cupón "${coupon.code}"? Esta acción no se puede deshacer.`)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </div>
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

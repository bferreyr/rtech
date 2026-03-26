import { getCoupon, updateCoupon } from "@/app/actions/coupons";
import { CouponForm } from "../../_components/CouponForm";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCouponPage({ params }: { params: { id: string } }) {
    const coupon = await getCoupon(params.id);

    if (!coupon) notFound();

    async function updateWithId(formData: FormData) {
        'use server';
        await updateCoupon(params.id, formData);
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <Link href="/admin/coupons" className="flex items-center text-sm text-[hsl(var(--text-secondary))] hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Volver a cupones
            </Link>

            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Ticket className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Editar Cupón</h1>
                    <p className="text-[hsl(var(--text-secondary))]">
                        Modificá el cupón <span className="font-mono font-bold text-[hsl(var(--accent-primary))]">{coupon.code}</span>
                    </p>
                </div>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <span className="text-[hsl(var(--text-tertiary))]">Usos: </span>
                    <span className="font-medium text-white">{coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <span className="text-[hsl(var(--text-tertiary))]">Estado: </span>
                    <span className={`font-medium ${coupon.active ? 'text-green-400' : 'text-red-400'}`}>
                        {coupon.active ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <span className="text-[hsl(var(--text-tertiary))]">Creado: </span>
                    <span className="font-medium text-white">
                        {new Date(coupon.createdAt).toLocaleDateString('es-AR')}
                    </span>
                </div>
            </div>

            <CouponForm
                action={updateWithId}
                defaultValues={{
                    id: coupon.id,
                    code: coupon.code,
                    description: coupon.description ?? undefined,
                    type: coupon.type,
                    value: Number(coupon.value),
                    minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
                    maxUses: coupon.maxUses,
                    oncePerUser: coupon.oncePerUser,
                    active: coupon.active,
                    expiresAt: coupon.expiresAt,
                }}
            />
        </div>
    );
}

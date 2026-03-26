import { createCoupon } from "@/app/actions/coupons";
import { CouponForm } from "../_components/CouponForm";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";

export default function NewCouponPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <Link href="/admin/coupons" className="flex items-center text-sm text-[hsl(var(--text-secondary))] hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Volver a cupones
            </Link>

            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[hsl(var(--accent-primary))]/10 border border-[hsl(var(--accent-primary))]/20">
                    <Ticket className="w-6 h-6 text-[hsl(var(--accent-primary))]" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nuevo Cupón</h1>
                    <p className="text-[hsl(var(--text-secondary))]">Crea un cupón de descuento para tus clientes.</p>
                </div>
            </div>

            <CouponForm action={createCoupon} />
        </div>
    );
}

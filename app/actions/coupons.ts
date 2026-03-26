'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// ─── Admin: listar cupones ────────────────────────────────────────────────────
export async function getCoupons() {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") return [];

    return await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { usages: true } } }
    });
}

// ─── Admin: obtener uno ───────────────────────────────────────────────────────
export async function getCoupon(id: string) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") return null;

    return await prisma.coupon.findUnique({ where: { id } });
}

// ─── Admin: crear cupón ───────────────────────────────────────────────────────
export async function createCoupon(formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

    const code = (formData.get('code') as string).trim().toUpperCase();
    const description = formData.get('description') as string || null;
    const type = formData.get('type') as 'PERCENTAGE' | 'FIXED_ARS';
    const value = parseFloat(formData.get('value') as string);
    const minOrderAmount = formData.get('minOrderAmount') ? parseFloat(formData.get('minOrderAmount') as string) : null;
    const maxUses = formData.get('maxUses') ? parseInt(formData.get('maxUses') as string) : null;
    const oncePerUser = formData.get('oncePerUser') === 'true';
    const active = formData.get('active') !== 'false';
    const expiresAt = formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null;

    await prisma.coupon.create({
        data: { code, description, type, value, minOrderAmount, maxUses, oncePerUser, active, expiresAt }
    });

    revalidatePath('/admin/coupons');
    redirect('/admin/coupons');
}

// ─── Admin: actualizar cupón ──────────────────────────────────────────────────
export async function updateCoupon(id: string, formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

    const code = (formData.get('code') as string).trim().toUpperCase();
    const description = formData.get('description') as string || null;
    const type = formData.get('type') as 'PERCENTAGE' | 'FIXED_ARS';
    const value = parseFloat(formData.get('value') as string);
    const minOrderAmount = formData.get('minOrderAmount') ? parseFloat(formData.get('minOrderAmount') as string) : null;
    const maxUses = formData.get('maxUses') ? parseInt(formData.get('maxUses') as string) : null;
    const oncePerUser = formData.get('oncePerUser') === 'true';
    const active = formData.get('active') !== 'false';
    const expiresAt = formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null;

    await prisma.coupon.update({
        where: { id },
        data: { code, description, type, value, minOrderAmount, maxUses, oncePerUser, active, expiresAt }
    });

    revalidatePath('/admin/coupons');
    redirect('/admin/coupons');
}

// ─── Admin: eliminar cupón ────────────────────────────────────────────────────
export async function deleteCoupon(id: string) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

    await prisma.coupon.delete({ where: { id } });

    revalidatePath('/admin/coupons');
}

// ─── Admin: activar/desactivar ────────────────────────────────────────────────
export async function toggleCoupon(id: string, active: boolean) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

    await prisma.coupon.update({ where: { id }, data: { active } });
    revalidatePath('/admin/coupons');
}

// ─── Checkout: validar cupón ──────────────────────────────────────────────────
export async function validateCoupon(
    code: string,
    userId: string | null,
    orderSubtotal: number
): Promise<{ valid: true; discountAmount: number; couponId: string; message: string } | { valid: false; error: string }> {
    const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });

    if (!coupon) return { valid: false, error: 'El cupón no existe' };
    if (!coupon.active) return { valid: false, error: 'El cupón no está activo' };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, error: 'El cupón expiró' };
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) return { valid: false, error: 'El cupón ya alcanzó su límite de usos' };
    if (coupon.minOrderAmount && orderSubtotal < Number(coupon.minOrderAmount)) {
        return { valid: false, error: `El pedido mínimo para este cupón es $${Number(coupon.minOrderAmount).toLocaleString('es-AR')} ARS` };
    }

    // Check once-per-user
    if (coupon.oncePerUser && userId) {
        const existing = await prisma.couponUsage.findFirst({
            where: { couponId: coupon.id, userId }
        });
        if (existing) return { valid: false, error: 'Ya usaste este cupón anteriormente' };
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
        discountAmount = Math.round(orderSubtotal * (Number(coupon.value) / 100));
    } else {
        discountAmount = Math.min(Number(coupon.value), orderSubtotal);
    }

    const label = coupon.type === 'PERCENTAGE'
        ? `${coupon.value}% de descuento`
        : `$${Number(coupon.value).toLocaleString('es-AR')} de descuento`;

    return { valid: true, discountAmount, couponId: coupon.id, message: `✓ Cupón "${coupon.code}" aplicado — ${label}` };
}

'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createPreference } from "@/lib/mercadopago";

interface CheckoutData {
    userId?: string; // Optional, for logged in users
    email: string;
    name: string;
    phone?: string;
    address?: string;
    city?: string;
    province?: string;
    zip?: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    total: number;
}

export async function createOrder(data: CheckoutData) {
    try {
        // 1. Find or create user
        let user;
        if (data.userId) {
            user = await prisma.user.findUnique({ where: { id: data.userId } });
        }

        if (!user) {
            user = await prisma.user.findUnique({ where: { email: data.email } });
        }

        if (!user) {
            // Create guest user logic... or maybe we should require login? 
            // For now let's keep the existing logic but improve it
            user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: '', // Guest
                    role: 'USER'
                }
            });
        }

        // 2. Create Order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: data.total,
                status: 'PENDING',
                customerName: data.name,
                customerEmail: data.email,
                customerPhone: data.phone,
                shippingAddress: data.address,
                shippingCity: data.city,
                shippingProvince: data.province,
                shippingZip: data.zip,
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // 3. Update Stock
        for (const item of data.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            });
        }

        // 4. Generate Mercado Pago Preference
        // We need product titles for MP
        const mpItems = order.items.map(item => ({
            id: item.productId || 'unknown',
            title: item.product?.name || 'Producto',
            quantity: item.quantity,
            unit_price: Number(item.price)
        }));

        let mpUrl = null;
        try {
            mpUrl = await createPreference(mpItems, order.id);
        } catch (mpError) {
            console.error("Error creating MP preference:", mpError);
            // We continue even if MP fails, so the order is created. 
            // The user can try paying again later (need a flow for that) 
            // OR we return error. For now, let's return error so they know.
            return { success: false, error: 'Orden creada pero falló la generación de pago. Contacte soporte.' };
        }

        revalidatePath('/admin/orders');
        revalidatePath('/admin');

        return { success: true, orderId: order.id, url: mpUrl };

    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: 'No se pudo procesar la orden' };
    }
}

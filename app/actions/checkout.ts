'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CheckoutData {
    email: string;
    name: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    total: number;
}

export async function createOrder(data: CheckoutData) {
    try {
        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            // Create guest user
            user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: '', // Guest users don't have password
                    role: 'USER'
                }
            });
        }

        // Create order with items
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: data.total,
                status: 'PENDING',
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        // Update product stock
        for (const item of data.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }

        revalidatePath('/admin/orders');
        revalidatePath('/admin');

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: 'No se pudo procesar la orden' };
    }
}

'use server'

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });

        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
    } catch (error) {
        console.error("Failed to update order status", error);
        throw new Error("No se pudo actualizar el estado de la orden.");
    }
}

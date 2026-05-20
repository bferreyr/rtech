'use server'

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
        let paymentStatusUpdate: string | undefined = undefined;
        if (newStatus === 'PAID' || newStatus === 'SHIPPED' || newStatus === 'DELIVERED') {
            paymentStatusUpdate = 'PAID';
        } else if (newStatus === 'CANCELLED') {
            paymentStatusUpdate = 'CANCELLED';
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { 
                status: newStatus,
                ...(paymentStatusUpdate && { paymentStatus: paymentStatusUpdate })
            }
        });

        revalidatePath('/admin', 'layout');
    } catch (error) {
        console.error("Failed to update order status", error);
        throw new Error("No se pudo actualizar el estado de la orden.");
    }
}

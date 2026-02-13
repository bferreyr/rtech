import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();
        const orderItemCount = await prisma.orderItem.count();

        // Check for products in orders
        const productsInOrders = await prisma.product.count({
            where: {
                items: {
                    some: {}
                }
            }
        });

        return NextResponse.json({
            productCount,
            orderCount,
            orderItemCount,
            productsInOrders,
            message: "Debug Info"
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

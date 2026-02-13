import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        console.log('Profile API: Session:', session?.user?.id);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id;

        // 1. Fetch Orders
        let orders = [];
        try {
            orders = await prisma.order.findMany({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    shipment: true
                } as any,
                orderBy: { createdAt: 'desc' }
            });
            console.log(`Profile API: Found ${orders.length} orders`);
        } catch (e) {
            console.error('Profile API: Error fetching orders', e);
            throw e;
        }

        // 2. Fetch User
        let user = null;
        try {
            user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    // @ts-ignore
                    pointHistory: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            console.log('Profile API: User fetched', user?.id);
        } catch (e) {
            console.error('Profile API: Error fetching user', e);
            throw e;
        }

        // 3. Fetch Printing Jobs
        let printingJobs = [];
        try {
            printingJobs = await (prisma as any).printingJob.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            });
            console.log(`Profile API: Found ${printingJobs.length} printing jobs`);
        } catch (e) {
            console.error('Profile API: Error fetching printing jobs', e);
            // Don't crash if printing jobs fail (e.g. table doesn't exist yet)
            console.warn('Printing jobs table might not exist or schema mismatch');
        }

        // Serialize orders to handle null products (deleted)
        const serializedOrders = orders.map((order: any) => ({
            ...order,
            items: order.items.map((item: any) => ({
                ...item,
                product: item.product || {
                    id: 'deleted',
                    name: item.productName || 'Producto eliminado',
                    sku: item.productSku || 'N/A',
                    imageUrl: item.productImage || null,
                    description: 'Este producto ya no está disponible en el catálogo.',
                    price: item.price, // Preserve historical price
                    stock: 0,
                    category: null
                }
            }))
        }));

        return NextResponse.json({ orders: serializedOrders, user, printingJobs })
    } catch (error: any) {
        console.error('Error fetching profile data FULL:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
    }
}

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: { userId: (session.user as any).id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                shipment: true
            } as any,
            orderBy: { createdAt: 'desc' }
        })

        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            include: {
                // @ts-ignore
                pointHistory: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        const printingJobs = await (prisma as any).printingJob.findMany({
            where: { userId: (session.user as any).id },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

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
    } catch (error) {
        console.error('Error fetching profile data:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

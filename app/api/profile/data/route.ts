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

        return NextResponse.json({ orders, user })
    } catch (error) {
        console.error('Error fetching profile data:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

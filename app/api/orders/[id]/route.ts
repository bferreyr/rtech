import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Pedido no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);

    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Error al cargar el pedido' },
            { status: 500 }
        );
    }
}

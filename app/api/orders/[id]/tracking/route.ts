import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { trackingUrl } = await request.json();

        // Validate URL if provided
        if (trackingUrl && typeof trackingUrl === 'string') {
            try {
                new URL(trackingUrl);
            } catch {
                return NextResponse.json(
                    { error: 'URL inválida' },
                    { status: 400 }
                );
            }
        }

        const order = await prisma.order.update({
            where: { id },
            data: { trackingUrl: trackingUrl || null }
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Error updating tracking URL:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el link de seguimiento' },
            { status: 500 }
        );
    }
}

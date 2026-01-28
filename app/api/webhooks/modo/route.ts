import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getModoSettings } from '@/app/actions/settings';

// Helper to verify signature if applicable (Simplified for now)
// MODO typically sends signature in headers

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // MODO Webhook payload structure verification needed
        // Assuming standard structure: { status: 'COMPLETED', external_id: '...', ... }

        console.log('MODO Webhook received:', body);

        const { status, external_id } = body;

        if (!external_id) {
            return NextResponse.json({ error: 'Missing external_id' }, { status: 400 });
        }

        const orderId = external_id;

        // Map MODO status to our status
        let newStatus: string | null = null;

        if (status === 'COMPLETED' || status === 'APPROVED') {
            newStatus = 'PAID';
        } else if (status === 'REJECTED' || status === 'CANCELLED') {
            newStatus = 'CANCELLED';
        }

        if (newStatus) {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: newStatus as any }
            });
            console.log(`Order ${orderId} updated to ${newStatus}`);

            // If paid, we might want to send confirmation email here
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing MODO webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { syncElitProducts } from '@/app/actions/elit-sync';

export async function GET(req: Request) {
    try {
        // Simple authorization check for cron job
        const authHeader = req.headers.get('authorization');
        if (
            process.env.CRON_SECRET &&
            authHeader !== `Bearer ${process.env.CRON_SECRET}`
        ) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        console.log('[CRON] Starting ELIT products sync...');
        const result = await syncElitProducts();

        if (result.success) {
            console.log(`[CRON] ELIT sync completed. ${result.message}`);
            return NextResponse.json({ success: true, count: result.count, message: result.message });
        } else {
            console.error(`[CRON] ELIT sync failed: ${result.error}`);
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

    } catch (error: any) {
        console.error('[CRON] Unhandled error during ELIT sync:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

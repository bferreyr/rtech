import { NextResponse } from 'next/server';
import { getMPSettings, getExchangeRate } from '@/app/actions/settings';
import MercadoPagoConfig, { Payment } from 'mercadopago';

export async function GET() {
    const report: Record<string, any> = {};

    // 1. Check Access Token
    const settings = await getMPSettings();
    const accessToken = settings.accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN;

    report.accessToken = {
        fromDB: !!settings.accessToken,
        fromEnv: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
        resolved: !!accessToken,
        preview: accessToken ? `${accessToken.substring(0, 15)}...` : 'NOT CONFIGURED',
        isTest: accessToken?.startsWith('TEST-') ?? false,
    };

    // 2. Check Exchange Rate
    try {
        const { rate, isAutoUpdate } = await getExchangeRate();
        report.exchangeRate = { rate, isAutoUpdate, valid: rate > 0 };
    } catch (e: any) {
        report.exchangeRate = { error: e.message };
    }

    // 3. Check APP_URL
    report.appUrl = {
        value: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
        isLocalhost: (process.env.NEXT_PUBLIC_APP_URL || '').includes('localhost'),
        notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    };

    // 4. Try a simple MP API call
    if (accessToken) {
        try {
            const client = new MercadoPagoConfig({ accessToken });
            // Try to GET a non-existent payment to confirm the token works
            await new Payment(client).get({ id: '0' }).catch((err: any) => {
                const msg: string = err?.message || JSON.stringify(err);
                // These errors all confirm the token IS valid — MP rejected the request for
                // content reasons (ID is 0), not auth reasons.
                const tokenIsValid =
                    err?.status === 404 ||
                    err?.cause?.[0]?.code === 2000 ||
                    msg.includes("can't be less than or equal to zero") ||
                    msg.includes('payment_id');

                if (tokenIsValid) {
                    report.tokenTest = { status: 'OK', message: 'Token is valid (MP rejected test ID=0, which is expected)' };
                } else {
                    report.tokenTest = { status: 'ERROR', message: msg };
                }
            });
        } catch (e: any) {
            report.tokenTest = { status: 'EXCEPTION', message: e.message };
        }
    } else {
        report.tokenTest = { status: 'SKIPPED', message: 'No access token configured' };
    }

    return NextResponse.json(report, { status: 200 });
}

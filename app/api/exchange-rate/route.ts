import { NextResponse } from 'next/server';
import { getExchangeRate } from '@/app/actions/settings';

export async function GET() {
    try {
        const { rate, lastUpdated } = await getExchangeRate();

        return NextResponse.json({
            rate,
            lastUpdated: lastUpdated.toISOString()
        });
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exchange rate' },
            { status: 500 }
        );
    }
}

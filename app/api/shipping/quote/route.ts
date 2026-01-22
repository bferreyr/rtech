import { NextRequest, NextResponse } from 'next/server';
import { correoArgentinoService } from '@/lib/correo-argentino';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { destinationZip, weight, dimensions } = body;

        if (!destinationZip || !weight) {
            return NextResponse.json(
                { error: 'Missing required fields: destinationZip, weight' },
                { status: 400 }
            );
        }

        // Validate zip code format (4 digits for Argentina)
        if (!/^\d{4}$/.test(destinationZip)) {
            return NextResponse.json(
                { error: 'Invalid zip code format. Must be 4 digits.' },
                { status: 400 }
            );
        }

        const quotes = await correoArgentinoService.quoteShipment({
            destinationZip,
            weight: parseFloat(weight),
            dimensions: dimensions ? {
                width: parseFloat(dimensions.width),
                height: parseFloat(dimensions.height),
                depth: parseFloat(dimensions.depth)
            } : undefined
        });

        return NextResponse.json({ quotes });
    } catch (error: any) {
        console.error('Shipping quote error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to calculate shipping cost' },
            { status: 500 }
        );
    }
}

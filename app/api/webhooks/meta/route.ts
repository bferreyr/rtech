import { NextResponse } from 'next/server';

// Meta Webhook Verification
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Comprueba que el modo y el token sean correctos
    if (mode === 'subscribe' && token === 'rincontech-meta-2026') {
        // Responde con el challenge para verificar
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse('Forbidden', { status: 403 });
}

// Endpoint para recibir eventos futuros de Meta si decides usarlos
export async function POST(request: Request) {
    return NextResponse.json({ success: true }, { status: 200 });
}

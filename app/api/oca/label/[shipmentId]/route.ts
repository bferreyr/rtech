import { NextResponse } from 'next/server';
import { getOCALabel } from '@/app/actions/oca';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ shipmentId: string }> }
) {
    try {
        const { shipmentId } = await params;

        const result = await getOCALabel(shipmentId, 'pdf');

        if (!result.success || !result.label) {
            return NextResponse.json(
                { error: result.error || 'No se pudo obtener la etiqueta' },
                { status: 404 }
            );
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(result.label, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="etiqueta-${shipmentId}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error downloading OCA label:', error);
        return NextResponse.json(
            { error: 'Error al descargar etiqueta' },
            { status: 500 }
        );
    }
}

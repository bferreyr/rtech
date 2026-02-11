import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Security: prevent directory traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return new NextResponse('Invalid filename', { status: 400 });
        }

        const filePath = join(process.cwd(), 'uploads', 'receipts', filename);

        if (!existsSync(filePath)) {
            return new NextResponse('File not found', { status: 404 });
        }

        const fileBuffer = await readFile(filePath);

        // Determine content type based on extension
        const ext = filename.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream';

        if (ext === 'pdf') {
            contentType = 'application/pdf';
        } else if (ext === 'png') {
            contentType = 'image/png';
        } else if (ext === 'jpg' || ext === 'jpeg') {
            contentType = 'image/jpeg';
        } else if (ext === 'webp') {
            contentType = 'image/webp';
        }

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving receipt:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

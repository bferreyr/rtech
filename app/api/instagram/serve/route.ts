import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return new NextResponse('Missing id', { status: 400 });
    
    try {
        const filePath = path.join(process.cwd(), '.next', 'cache', 'ig', `${id}.jpg`);
        const buffer = await fs.readFile(filePath);
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000'
            }
        });
    } catch (e) {
        return new NextResponse('Not found', { status: 404 });
    }
}

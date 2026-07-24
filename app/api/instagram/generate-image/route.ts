import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const format = searchParams.get('format') || 'story'; // 'story' or 'feed'

    if (!productId) {
        return new NextResponse('Missing productId', { status: 400 });
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product || !product.imageUrl) {
            return new NextResponse('Product or image not found', { status: 404 });
        }

        const imageRes = await fetch(product.imageUrl);
        const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
        
        let width = 1080;
        let height = format === 'feed' ? 1080 : 1920;
        
        const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
        const price = formatter.format(Number(product.price));
        
        const isGamer = product.categoria?.toLowerCase().includes('gamer') || product.name.toLowerCase().includes('gamer');
        const lowStock = (product.stockTotal || 0) < 5 && (product.stockTotal || 0) > 0;
        
        // Create an SVG overlay
        const svg = `
            <svg width="${width}" height="${height}">
                <style>
                    .title { font-family: sans-serif; font-size: 38px; fill: white; font-weight: bold; }
                    .price { font-family: sans-serif; font-size: 60px; fill: #10b981; font-weight: bold; }
                    .badge { font-family: sans-serif; font-size: 20px; fill: white; font-weight: bold; }
                    .cta { font-family: sans-serif; font-size: 24px; fill: white; font-weight: bold; }
                    .info { font-family: sans-serif; font-size: 24px; fill: #e5e7eb; }
                    .alert { font-family: sans-serif; font-size: 24px; fill: #ef4444; font-weight: bold; }
                </style>
                <rect x="50" y="${height - 350}" width="${width - 100}" height="300" rx="20" fill="rgba(0,0,0,0.85)" />
                
                ${isGamer ? `<rect x="80" y="${height - 320}" width="150" height="36" rx="8" fill="#8b5cf6" />
                             <text x="155" y="${height - 295}" class="badge" text-anchor="middle">🎮 GAMER</text>` : ''}
                
                <text x="80" y="${height - 240}" class="title">${escapeXml(product.name).substring(0, 50)}${product.name.length > 50 ? '...' : ''}</text>
                
                <text x="80" y="${height - 160}" class="price">${price}</text>
                
                ${lowStock ? `<text x="80" y="${height - 110}" class="alert">⚠️ ¡Quedan pocos! No te quedes sin el tuyo</text>` : ''}
                
                <text x="80" y="${height - 70}" class="info">🚚 Envíos a todo el país</text>
                
                <rect x="${width - 320}" y="${height - 130}" width="240" height="60" rx="30" fill="#3b82f6" />
                <text x="${width - 200}" y="${height - 90}" class="cta" text-anchor="middle">Link en la BIO</text>
            </svg>
        `;

        let finalImageBuffer;

        if (format === 'story') {
            // Story logic: background blurred, image centered top, SVG overlay
            const background = await sharp(imageBuffer)
                .resize(width, height, { fit: 'cover' })
                .blur(20)
                .modulate({ brightness: 0.5 })
                .toBuffer();

            const foreground = await sharp(imageBuffer)
                .resize(900, 900, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer();

            finalImageBuffer = await sharp(background)
                .composite([
                    { input: foreground, top: 300, left: 90 },
                    { input: Buffer.from(svg), top: 0, left: 0 }
                ])
                .jpeg({ quality: 90 })
                .toBuffer();
        } else {
            // Feed logic: 1080x1080 image, background if it's not square, SVG overlay
            const base = await sharp(imageBuffer)
                .resize(width, height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
                .toBuffer();

            finalImageBuffer = await sharp(base)
                .composite([
                    { input: Buffer.from(svg), top: 0, left: 0 }
                ])
                .jpeg({ quality: 90 })
                .toBuffer();
        }

        return new NextResponse(finalImageBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (error) {
        console.error('Error generating image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

function escapeXml(unsafe: string) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "'": return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

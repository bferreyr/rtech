import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

import { getExchangeRate } from '@/app/actions/settings';

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
        
        const settings = await getExchangeRate();
        const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
        const finalPriceInARS = Number(product.price) * settings.rate;
        const price = formatter.format(finalPriceInARS);
        
        const isGamer = product.categoria?.toLowerCase().includes('gamer') || product.name.toLowerCase().includes('gamer');
        const lowStock = (product.stockTotal || 0) < 5 && (product.stockTotal || 0) > 0;
        
        // Create an SVG overlay
        const svg = `
            <svg width="${width}" height="${height}">
                <style>
                    .title { font-family: 'Outfit', sans-serif; font-size: 34px; fill: white; font-weight: bold; }
                    .price { font-family: 'Outfit', sans-serif; font-size: 60px; fill: #10b981; font-weight: bold; }
                    .badge { font-family: 'Outfit', sans-serif; font-size: 20px; fill: white; font-weight: bold; }
                    .cta { font-family: 'Outfit', sans-serif; font-size: 24px; fill: white; font-weight: bold; }
                    .info { font-family: 'Outfit', sans-serif; font-size: 24px; fill: #e5e7eb; }
                    .alert { font-family: 'Outfit', sans-serif; font-size: 24px; fill: #ef4444; font-weight: bold; }
                </style>
                <rect x="50" y="${height - 350}" width="${width - 100}" height="300" rx="20" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
                
                ${isGamer ? `<rect x="${(width/2) - 75}" y="${height - 320}" width="150" height="36" rx="8" fill="#8b5cf6" />
                             <text x="50%" y="${height - 295}" class="badge" text-anchor="middle">🎮 GAMER</text>` : ''}
                
                <text x="50%" y="${height - 240}" class="title" text-anchor="middle">${escapeXml(product.name).substring(0, 50)}${product.name.length > 50 ? '...' : ''}</text>
                
                <text x="50%" y="${height - 160}" class="price" text-anchor="middle">${price}</text>
                
                ${lowStock ? `<text x="50%" y="${height - 110}" class="alert" text-anchor="middle">⚠️ ¡Quedan pocos! No te quedes sin el tuyo</text>` : ''}
                
                <text x="50%" y="${height - 70}" class="info" text-anchor="middle">🚚 Envíos a todo el país</text>
                
                <!-- CTA Button at bottom center if no low stock, or just float it -->
                <rect x="${(width/2) - 120}" y="${lowStock ? height - 60 : height - 120}" width="240" height="40" rx="20" fill="#3b82f6" opacity="${lowStock ? 0 : 1}" />
                <text x="50%" y="${lowStock ? height - 30 : height - 92}" class="cta" text-anchor="middle" opacity="${lowStock ? 0 : 1}">Link en la BIO</text>
            </svg>
        `;

        let finalImageBuffer;

        // Both use dark blurred background now
        const background = await sharp(imageBuffer)
            .resize(width, height, { fit: 'cover' })
            .blur(30)
            .modulate({ brightness: 0.3 })
            .toBuffer();

        if (format === 'story') {
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
            // Feed logic: 1080x1080 image
            const foreground = await sharp(imageBuffer)
                .resize(900, 650, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer();

            finalImageBuffer = await sharp(background)
                .composite([
                    { input: foreground, top: 50, left: 90 },
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

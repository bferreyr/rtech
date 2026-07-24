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
        
        // Split product name into two lines for better centering and no overflow
        const name = product.name;
        let line1 = name;
        let line2 = '';
        if (name.length > 38) {
            const splitIndex = name.lastIndexOf(' ', 38);
            if (splitIndex > -1) {
                line1 = name.substring(0, splitIndex);
                line2 = name.substring(splitIndex + 1);
            } else {
                line1 = name.substring(0, 38);
                line2 = name.substring(38);
            }
            if (line2.length > 38) line2 = line2.substring(0, 35) + '...';
        }

        // Create an SVG overlay
        // Layout designed dynamically from the bottom up to ensure 0 overlaps.
        const svg = `
            <svg width="${width}" height="${height}">
                <style>
                    .title { font-family: 'Outfit', sans-serif; font-size: 36px; fill: white; font-weight: bold; }
                    .price { font-family: 'Outfit', sans-serif; font-size: 70px; fill: #10b981; font-weight: bold; }
                    .badge { font-family: 'Outfit', sans-serif; font-size: 20px; fill: white; font-weight: bold; }
                    .cta { font-family: 'Outfit', sans-serif; font-size: 26px; fill: white; font-weight: bold; }
                    .info { font-family: 'Outfit', sans-serif; font-size: 24px; fill: #e5e7eb; }
                    .cuotas { font-family: 'Outfit', sans-serif; font-size: 26px; fill: #60a5fa; font-weight: bold; }
                    .alert { font-family: 'Outfit', sans-serif; font-size: 22px; fill: #ef4444; font-weight: bold; }
                </style>
                <rect x="50" y="${height - 540}" width="${width - 100}" height="500" rx="24" fill="rgba(15, 23, 42, 0.90)" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
                
                ${isGamer ? `<rect x="${(width/2) - 75}" y="${height - 510}" width="150" height="36" rx="8" fill="#8b5cf6" />
                             <text x="50%" y="${height - 485}" class="badge" text-anchor="middle">🎮 GAMER</text>` : ''}
                
                <text x="50%" y="${height - 425}" class="title" text-anchor="middle">${escapeXml(line1)}</text>
                ${line2 ? `<text x="50%" y="${height - 385}" class="title" text-anchor="middle">${escapeXml(line2)}</text>` : ''}
                
                <text x="50%" y="${height - 280}" class="price" text-anchor="middle">${price}</text>
                
                <text x="50%" y="${height - 215}" class="cuotas" text-anchor="middle">💳 Hasta 24 cuotas fijas</text>
                
                <text x="50%" y="${height - 175}" class="info" text-anchor="middle">🚚 Envíos a todo el país</text>
                
                ${lowStock ? `<text x="50%" y="${height - 135}" class="alert" text-anchor="middle">⚠️ ¡Quedan pocos! No te quedes sin el tuyo</text>` : ''}
                
                <!-- CTA Button -->
                <rect x="${(width/2) - 140}" y="${height - 110}" width="280" height="48" rx="24" fill="#3b82f6" />
                <text x="50%" y="${height - 76}" class="cta" text-anchor="middle">🔗 Link en la BIO</text>
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

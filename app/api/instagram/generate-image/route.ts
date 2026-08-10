import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

import { getExchangeRate, getGlobalMarkup } from '@/app/actions/settings';

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
        const globalMarkup = await getGlobalMarkup();
        const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
        
        const base = product.pvpUsd ? Number(product.pvpUsd) : (product.precio || product.price);
        const finalUsd = Number(base) * (1 + globalMarkup / 100);
        const finalPriceInARS = finalUsd * settings.rate;
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
                
                <g transform="translate(${(width/2) - 165}, ${height - 238})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    <text x="40" y="22" class="cuotas" text-anchor="start">Hasta 24 cuotas fijas</text>
                </g>
                
                <g transform="translate(${(width/2) - 160}, ${height - 198})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 17h4V5H2v12h3" />
                        <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
                        <path d="M14 17h1" />
                        <circle cx="7.5" cy="17.5" r="2.5" />
                        <circle cx="17.5" cy="17.5" r="2.5" />
                    </svg>
                    <text x="40" y="21" class="info" text-anchor="start">Envíos a todo el país</text>
                </g>
                
                ${lowStock ? `
                <g transform="translate(${(width/2) - 245}, ${height - 158})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                    </svg>
                    <text x="40" y="21" class="alert" text-anchor="start">¡Quedan pocos! No te quedes sin el tuyo</text>
                </g>
                ` : ''}
                
                <!-- CTA Button -->
                <rect x="${(width/2) - 140}" y="${height - 110}" width="280" height="48" rx="24" fill="#3b82f6" />
                <g transform="translate(${(width/2) - 105}, ${height - 101})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <text x="40" y="22" class="cta" text-anchor="start">Link en la BIO</text>
                </g>
            </svg>
        `;

        let finalImageBuffer;
        const aiKey = process.env.GEMINI_API_KEY;
        let baseImageBuffer;

        if (aiKey) {
            try {
                const { GoogleGenAI } = await import('@google/genai');
                const ai = new GoogleGenAI({ apiKey: aiKey });
                let environment = "modern, dark moody gaming setup environment with subtle neon lights";
                if (product.categoria) {
                    const cat = product.categoria.toLowerCase();
                    if (cat.includes('herramienta')) {
                        environment = "professional, well-lit workshop or garage desk environment with subtle industrial vibes";
                    } else if (cat.includes('almacenamiento') || cat.includes('disco') || cat.includes('ssd') || cat.includes('memoria')) {
                        environment = "clean, high-tech minimalist desk setup with soft cool lighting";
                    } else if (cat.includes('notebook') || cat.includes('laptop')) {
                        environment = "modern, sleek office desk setup with natural window light";
                    } else if (cat.includes('silla') || cat.includes('mueble')) {
                        environment = "modern, stylish room interior with warm ambient lighting";
                    } else if (!isGamer) {
                        environment = `aesthetic, professional environment suitable for ${product.categoria}`;
                    }
                }
                
                const prompt = `A highly aesthetic, professional 4k product photography shot. Place the product in a ${environment}. Ensure there is empty negative space at the bottom for text. Do not add any text, letters, or watermarks.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-3.1-flash-image',
                    contents: [
                        { text: prompt },
                        { inlineData: { mimeType: 'image/jpeg', data: imageBuffer.toString('base64') } }
                    ]
                });

                // Google Gen AI SDK response handling for images
                let base64Data = null;
                if (response.candidates && response.candidates.length > 0) {
                    const firstPart = response.candidates[0].content?.parts?.[0];
                    if (firstPart?.inlineData?.data) {
                        base64Data = firstPart.inlineData.data;
                    }
                }
                
                if (base64Data) {
                    const aiImage = Buffer.from(base64Data, 'base64');
                    // Ensure the AI image matches our requested dimensions
                    baseImageBuffer = await sharp(aiImage)
                        .resize(width, height, { fit: 'cover' })
                        .toBuffer();
                }
            } catch (err) {
                console.error("Nano Banana (Gemini Image) generation failed:", err);
            }
        }

        if (!baseImageBuffer) {
            // Fallback to old blurred background + foreground composite if AI fails or no key
            const background = await sharp(imageBuffer)
                .resize(width, height, { fit: 'cover' })
                .blur(30)
                .modulate({ brightness: 0.3 })
                .toBuffer();

            const foreground = await sharp(imageBuffer)
                .resize(900, format === 'story' ? 900 : 650, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer();

            baseImageBuffer = await sharp(background)
                .composite([
                    { input: foreground, top: format === 'story' ? 300 : 50, left: 90 }
                ])
                .toBuffer();
        }

        // Add the SVG text overlay on top of the base image
        finalImageBuffer = await sharp(baseImageBuffer)
            .composite([
                { input: Buffer.from(svg), top: 0, left: 0 }
            ])
            .jpeg({ quality: 90 })
            .toBuffer();

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

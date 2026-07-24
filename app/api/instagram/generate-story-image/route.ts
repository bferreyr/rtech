import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return new NextResponse('Missing productId', { status: 400 });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { imageUrl: true }
        });

        if (!product || !product.imageUrl) {
            return new NextResponse('Product or image not found', { status: 404 });
        }

        // Fetch original image
        const imageRes = await fetch(product.imageUrl);
        if (!imageRes.ok) throw new Error('Failed to fetch original image');
        
        const imageBuffer = await imageRes.arrayBuffer();

        // Target Story dimensions (1080x1920 is standard 9:16)
        const width = 1080;
        const height = 1920;

        // Create blurred background
        const background = await sharp(Buffer.from(imageBuffer))
            .resize(width, height, { fit: 'cover' })
            .blur(50)
            .modulate({ brightness: 0.6 }) // Darken slightly
            .toBuffer();

        // Resize foreground image to fit inside 1080 width, keeping aspect ratio
        const foreground = await sharp(Buffer.from(imageBuffer))
            .resize(width, width, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toBuffer();

        // Composite foreground over background
        const finalImage = await sharp(background)
            .composite([{
                input: foreground,
                gravity: 'center'
            }])
            .jpeg({ quality: 90 })
            .toBuffer();

        return new NextResponse(finalImage, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=86400'
            }
        });
    } catch (error) {
        console.error('Error generating story image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { GoogleGenAI } from '@google/genai';

const IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID;
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rincontech.ar';

async function createMediaContainer(imageUrl: string, caption: string, isStory: boolean = false) {
    if (!IG_ACCOUNT_ID || !IG_ACCESS_TOKEN) {
        throw new Error('Instagram credentials not configured in environment variables.');
    }

    const url = `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`;
    
    const params = new URLSearchParams({
        image_url: imageUrl,
        access_token: IG_ACCESS_TOKEN
    });

    if (isStory) {
        params.append('media_type', 'STORIES');
    } else {
        params.append('caption', caption);
    }

    const res = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await res.json();

    if (data.error) {
        throw new Error(`Instagram API Error: ${data.error.message}`);
    }

    return data.id; // creation_id
}

async function publishMediaContainer(creationId: string) {
    const url = `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media_publish`;
    
    const params = new URLSearchParams({
        creation_id: creationId,
        access_token: IG_ACCESS_TOKEN as string
    });

    // We might need to wait for the container to be ready, but usually images are instant.
    // If it fails with "Media ID is not available", we should add a delay/retry logic.
    let retries = 3;
    while (retries > 0) {
        const res = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
        const data = await res.json();

        if (data.error) {
            if (data.error.code === 9007 || data.error.message.includes('not published')) {
                // Not ready yet
                await new Promise(r => setTimeout(r, 3000));
                retries--;
                continue;
            }
            throw new Error(`Instagram Publish Error: ${data.error.message}`);
        }

        return data.id; // post_id
    }
    throw new Error('Timeout waiting for Instagram media container to be ready.');
}

function formatPrice(amount: number) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
}

export async function publishToInstagram(productId: string, type: 'FEED' | 'STORY' | 'BOTH') {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) throw new Error('Product not found');
        if (!product.imageUrl) throw new Error('Product has no image');
        
        let postIds: string[] = [];

        if (type === 'FEED' || type === 'BOTH') {
            let caption = `🔥 ${product.name}\n\n💻 ¡Mejora tu setup hoy mismo con Rincón Tech!\n✅ En Stock\n🚚 Envío a todo el país\n💳 Hasta 24 cuotas\n🔗 Link en bio o búscalo en nuestra web como: ${product.slug}\n\n#hardware #gamer #rincontech #tecnologia #pcgamer #gaming`;

            if (process.env.GEMINI_API_KEY) {
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                    const prompt = `Escribe un caption llamativo para Instagram para vender este producto de hardware:
Nombre: ${product.name}
Marca: ${product.marca || 'Genérica'}
Categoría: ${product.categoria || 'Hardware'}
Atributos: ${product.atributos || product.description || ''}

Reglas:
- Tono: Entusiasta, gamer, profesional.
- Incluye emojis.
- Incluye explícitamente "🚚 Envío a todo el país" y "💳 Hasta 24 cuotas" en la descripción.
- Agrega una llamada a la acción invitando a comprar en rincontech.ar (busca el producto como: ${product.slug}).
- Mantén el texto por debajo de las 100 palabras.
- Incluye 5 hashtags relevantes al final.`;
                    
                    const result = await ai.models.generateContent({
                        model: "gemini-3.1-flash-lite",
                        contents: prompt
                    });
                    caption = result.text || caption;
                } catch (e) {
                    console.error("Gemini API Error, falling back to static caption:", e);
                }
            }

            const generateUrl = `${SITE_URL}/api/instagram/generate-image?format=feed&productId=${product.id}`;
            const res = await fetch(generateUrl);
            if (!res.ok) throw new Error("Failed to generate feed image");
            
            const buffer = Buffer.from(await res.arrayBuffer());
            const fileName = `feed-${product.id}-${Date.now()}`;
            const cacheDir = require('path').join(process.cwd(), '.next', 'cache', 'ig');
            await require('fs').promises.mkdir(cacheDir, { recursive: true });
            await require('fs').promises.writeFile(require('path').join(cacheDir, `${fileName}.jpg`), buffer);
            
            const feedImageUrl = `${SITE_URL}/api/instagram/serve?id=${fileName}`;
            const creationId = await createMediaContainer(feedImageUrl, caption, false);
            const postId = await publishMediaContainer(creationId);
            postIds.push(postId);
        }

        if (type === 'STORY' || type === 'BOTH') {
            const generateUrl = `${SITE_URL}/api/instagram/generate-image?format=story&productId=${product.id}`;
            const res = await fetch(generateUrl);
            if (!res.ok) throw new Error("Failed to generate story image");
            
            const buffer = Buffer.from(await res.arrayBuffer());
            const fileName = `story-${product.id}-${Date.now()}`;
            const cacheDir = require('path').join(process.cwd(), '.next', 'cache', 'ig');
            await require('fs').promises.mkdir(cacheDir, { recursive: true });
            await require('fs').promises.writeFile(require('path').join(cacheDir, `${fileName}.jpg`), buffer);
            
            const storyImageUrl = `${SITE_URL}/api/instagram/serve?id=${fileName}`;
            const creationId = await createMediaContainer(storyImageUrl, '', true);
            const postId = await publishMediaContainer(creationId);
            postIds.push(postId);
        }

        // Update DB
        await prisma.product.update({
            where: { id: productId },
            data: {
                igLastPublishedAt: new Date(),
                igPostId: postIds[0] // Save at least one
            }
        });

        revalidatePath('/admin/products');
        return { success: true, message: `Publicado exitosamente en Instagram (${postIds.length} posts)` };
    } catch (error: any) {
        console.error('publishToInstagram Error:', error);
        return { success: false, error: error.message };
    }
}

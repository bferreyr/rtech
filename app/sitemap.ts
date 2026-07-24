import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await prisma.product.findMany({
        select: { id: true, slug: true, updatedAt: true },
    });

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `https://rincontech.ar/products/${product.slug || product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [
        {
            url: "https://rincontech.ar",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: "https://rincontech.ar/products",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        ...productEntries,
    ];
}

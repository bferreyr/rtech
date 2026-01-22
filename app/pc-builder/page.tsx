import { prisma } from "@/lib/prisma";
import { PCBuilder } from "@/components/pc-builder/PCBuilder";
import { Sparkles } from "lucide-react";
import { getRandomContent, BUILDER_TITLES, BUILDER_SUBTITLES } from "@/lib/marketing-content";

export const dynamic = 'force-dynamic';

async function getPCBuilderData() {
    // Configuration: Map Builder Step Slug -> Array of Database Category Slugs to include
    const BUILDER_MAPPING: Record<string, string[]> = {
        'procesadores': ['procesadores'],
        'motherboards': ['motherboards'],
        'memorias': ['memorias-pc'], // ONLY Memorias PC
        'placas-de-video': ['placas-de-video'],
        'almacenamiento': ['discos-internos', 'discos-internos-ssd'], // ONLY Discos Internos & SSD
        'fuentes': ['fuentes'],
        'gabinetes': ['gabinetes']
    };

    const allSourceSlugs = Object.values(BUILDER_MAPPING).flat();

    try {
        // Fetch specific categories needed
        // @ts-ignore
        const categories = await prisma.category.findMany({
            where: {
                slug: { in: allSourceSlugs }
            },
            include: {
                products: {
                    where: { stock: { gt: 0 } }
                }
            }
        });

        const mapProduct = (p: any) => ({
            ...p,
            price: Number(p.price),
            precio: p.precio ? Number(p.precio) : null,
            impuestoInterno: p.impuestoInterno ? Number(p.impuestoInterno) : null,
            iva: p.iva ? Number(p.iva) : null,
            markup: p.markup ? Number(p.markup) : null,
            cotizacion: p.cotizacion ? Number(p.cotizacion) : null,
            pvpUsd: p.pvpUsd ? Number(p.pvpUsd) : null,
            pvpArs: p.pvpArs ? Number(p.pvpArs) : null,
            peso: p.peso ? Number(p.peso) : null,
            weight: p.weight ? Number(p.weight) : null,
        });

        // Construct the result objects expected by the frontend, aggregating products
        return Object.entries(BUILDER_MAPPING).map(([stepSlug, sourceSlugs]) => {
            // Find all DB categories that match the slugs for this step
            const matchingCats = categories.filter((c: any) => sourceSlugs.includes(c.slug));

            // Flatten and map products from all matching categories
            const aggregatedProducts = matchingCats.flatMap((c: any) => c.products.map(mapProduct));

            return {
                id: stepSlug, // Virtual ID
                name: stepSlug, // Name not strictly used for display (frontend uses step label), but kept for structure
                slug: stepSlug, // CRITICAL: This matches the key in PCBuilder.STEPS
                imageUrl: matchingCats[0]?.imageUrl || null,
                products: aggregatedProducts
            };
        });

    } catch (e) {
        console.error('Builder data fetch failed', e);
        return [];
    }
}

export default async function PCBuilderPage() {
    const categories = await getPCBuilderData();

    return (
        <div className="min-h-screen pt-24 pb-32">
            <div className="container px-4 mb-16 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent-primary))]/10 border border-[hsl(var(--accent-primary))]/20 mb-4">
                    <Sparkles className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--accent-primary))]">Build Your Dream PC</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                    {getRandomContent(BUILDER_TITLES).split(' ').map((word, i, arr) => (
                        <span key={i}>
                            {i === arr.length - 1 ? <span className="gradient-text">{word}</span> : word}{' '}
                        </span>
                    ))}
                </h1>
                <p className="text-[hsl(var(--text-secondary))] max-w-2xl mx-auto text-lg">
                    {getRandomContent(BUILDER_SUBTITLES)}
                </p>
            </div>

            <PCBuilder categories={categories} />
        </div>
    );
}

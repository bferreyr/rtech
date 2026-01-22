import { StoreFront } from "@/components/product/StoreFront";
import { BrandsCarousel } from "@/components/ui/BrandsCarousel";
import { getCategories, getProducts } from "@/app/actions/categories";
import { Sparkles, ArrowDown } from "lucide-react";
import { getRandomContent, HERO_TITLES, HERO_SUBTITLES } from "@/lib/marketing-content";

export const dynamic = 'force-dynamic';

export default async function Home(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const categoryId = searchParams.category as string;
    const sortBy = searchParams.sort as any;

    const { products, pagination } = await getProducts({
        page,
        limit: 12,
        categoryId,
        sortBy
    });
    const categories = await getCategories();

    const title = getRandomContent(HERO_TITLES);
    const subtitle = getRandomContent(HERO_SUBTITLES);

    return (
        <div className="min-h-screen">
            {/* Minimalist Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-[hsl(var(--bg-primary))]">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--accent-primary))]/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--accent-secondary))]/10 rounded-full blur-[120px] animate-pulse delay-700" />
                </div>

                <div className="container relative z-10 text-center px-4 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Sparkles className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-secondary))]">Premium Hardware Store</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                        {title.split(' ').map((word, i, arr) => (
                            <span key={i}>
                                {i === arr.length - 1 ? <span className="gradient-text">{word}</span> : word}{' '}
                            </span>
                        ))}
                    </h1>

                    <p className="text-lg md:text-xl text-[hsl(var(--text-secondary))] mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 leading-relaxed">
                        {subtitle}
                    </p>

                    <div className="flex justify-center animate-bounce duration-1000 delay-1000">
                        <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <ArrowDown size={20} className="text-[hsl(var(--text-tertiary))]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Product Section */}
            <section className="container pb-32">
                <div className="flex flex-col gap-2 mb-12 px-4">
                    <h2 className="text-3xl font-bold tracking-tight">Catálogo Completo</h2>
                    <p className="text-[hsl(var(--text-secondary))]">Explora nuestra selección curada de hardware de alta gama.</p>
                </div>

                <StoreFront
                    initialProducts={products}
                    categories={categories}
                    pagination={pagination}
                />
            </section>

            {/* Brands Section */}
            <BrandsCarousel />
        </div>
    );
}

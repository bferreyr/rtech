import { StoreFront } from "@/components/product/StoreFront";
import { BrandsCarousel } from "@/components/ui/BrandsCarousel";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { getCategories, getProducts } from "@/app/actions/categories";
import { getAvailableFilters } from "@/app/actions/products";
import { getCarouselSlides } from "@/app/actions/carousel";

export const dynamic = 'force-dynamic';

export default async function Home(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const categoryId = searchParams.category as string;
    const sortBy = searchParams.sort as any;
    const search = searchParams.search as string;
    const brands = searchParams.brands ? (searchParams.brands as string).split(',') : undefined;
    const priceMin = searchParams.priceMin ? Number(searchParams.priceMin) : undefined;
    const priceMax = searchParams.priceMax ? Number(searchParams.priceMax) : undefined;
    const inStock = searchParams.inStock === 'true' ? true : undefined;

    const [{ products, pagination }, categories, availableFilters, carouselSlides] = await Promise.all([
        getProducts({
            page,
            limit: 12,
            categoryId,
            sortBy,
            search,
            brands,
            minPrice: priceMin,
            maxPrice: priceMax,
            inStock
        }),
        getCategories(),
        getAvailableFilters(categoryId),
        getCarouselSlides()
    ]);

    return (
        <div className="min-h-screen">
            {/* Hero Carousel Section */}
            <HeroCarousel slides={carouselSlides.filter(s => s.active)} />

            {/* Main Product Section */}
            <section className="container pb-32 pt-12">
                <div className="flex flex-col gap-2 mb-12 px-4">
                    <h2 className="text-3xl font-bold tracking-tight">Catálogo Completo</h2>
                    <p className="text-[hsl(var(--text-secondary))]">Explora nuestra selección curada de hardware de alta gama.</p>
                </div>

                <StoreFront
                    initialProducts={products}
                    categories={categories}
                    pagination={pagination}
                    availableFilters={availableFilters}
                />
            </section>

            {/* Brands Section */}
            <BrandsCarousel />
        </div>
    );
}

import { getCategories, getProducts } from "@/app/actions/categories";
import { getAvailableFilters } from "@/app/actions/products";
import { StoreFront } from "@/components/product/StoreFront";
import { getRandomContent, CATALOG_TITLES, CATALOG_SUBTITLES } from "@/lib/marketing-content";

export const dynamic = 'force-dynamic';

export default async function ProductsPage(props: {
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

    const [{ products, pagination }, categories, availableFilters] = await Promise.all([
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
        getAvailableFilters(categoryId)
    ]);

    return (
        <div className="container py-12 space-y-12">
            <div className="flex flex-col gap-2 px-4">
                <h1 className="text-4xl font-bold tracking-tight">{getRandomContent(CATALOG_TITLES)}</h1>
                <p className="text-[color:var(--text-secondary)] text-lg">{getRandomContent(CATALOG_SUBTITLES)}</p>
            </div>

            <StoreFront
                initialProducts={products}
                categories={categories}
                pagination={pagination}
                availableFilters={availableFilters}
            />
        </div>
    );
}

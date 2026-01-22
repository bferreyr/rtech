import { getFullSearchResults } from "@/app/actions/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Search } from "lucide-react";

export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query } = await searchParams;
    const products = await getFullSearchResults(query);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 text-[hsl(var(--text-tertiary))] mb-2">
                        <Search size={20} />
                        <span className="text-sm font-medium uppercase tracking-widest">Resultados de búsqueda</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        {query ? (
                            <>Buscando: <span className="gradient-text">"{query}"</span></>
                        ) : (
                            "Explorar Productos"
                        )}
                    </h1>
                </div>
                <p className="text-[hsl(var(--text-secondary))]">
                    {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                </p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 glass-card border-dashed">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Search size={40} className="text-[hsl(var(--text-tertiary))]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">No encontramos lo que buscas</h2>
                    <p className="text-[hsl(var(--text-secondary))] max-w-md mx-auto mb-8">
                        Intenta con términos más generales o verifica si el producto está escrito correctamente.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="/products" className="btn btn-primary">Ver todos los productos</a>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { Search, X, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchProducts } from '@/app/actions/products';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { formatUSD, formatARS } = useCurrency();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleSearch = async () => {
            if (query.length >= 2) {
                startTransition(async () => {
                    const products = await searchProducts(query);
                    setResults(products);
                });
            } else {
                setResults([]);
            }
        };

        const debounce = setTimeout(handleSearch, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onClose();
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[hsl(var(--bg-primary))]/95 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Actions */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <X size={32} className="text-[hsl(var(--text-secondary))] group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Search Input Area */}
                <form onSubmit={handleSubmit} className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[hsl(var(--text-secondary))] group-focus-within:text-[hsl(var(--accent-primary))] transition-colors" size={32} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar hardware, componentes, periféricos..."
                        className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 pl-20 pr-8 text-2xl font-medium focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-all placeholder:text-[hsl(var(--text-tertiary))]"
                    />
                    {isPending && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                            <Loader2 className="animate-spin text-[hsl(var(--accent-primary))]" size={24} />
                        </div>
                    )}
                </form>

                {/* Suggestions / Results Area */}
                <div className="mt-12 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar pr-4">
                    {results.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Sugerencias</h3>
                                <button
                                    onClick={handleSubmit}
                                    className="text-sm font-medium text-[hsl(var(--accent-primary))] hover:underline"
                                >
                                    Ver todos los resultados
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        onClick={onClose}
                                        className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 transition-all group"
                                    >
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[hsl(var(--bg-secondary))] flex-shrink-0">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingCart size={24} className="text-white/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-bold text-lg truncate group-hover:text-[hsl(var(--accent-primary))] transition-colors">{product.name}</h4>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-[hsl(var(--accent-primary))] font-bold">{formatUSD(product.price)}</span>
                                                <span className="text-xs text-[hsl(var(--text-tertiary))]">{formatARS(product.price)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <ArrowRight size={20} className="text-white/20 group-hover:text-[hsl(var(--accent-primary))] translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : query.length >= 2 && !isPending ? (
                        <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                            <p className="text-[hsl(var(--text-secondary))] text-xl">No encontramos resultados para "<span className="text-white font-medium">{query}</span>"</p>
                            <p className="text-[hsl(var(--text-tertiary))] mt-2">Prueba con palabras más generales o revisa la ortografía.</p>
                        </div>
                    ) : query.length < 2 ? (
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Búsquedas Frecuentes</h3>
                            <div className="flex flex-wrap gap-2">
                                {['NVIDIA RTX', 'Monitor 144Hz', 'SSD NVMe', 'Gabinete RGB', 'Teclado Mecánico'].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

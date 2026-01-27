'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useState, useEffect } from 'react';

interface StoreFrontProps {
    initialProducts: any[];
    categories: any[];
    pagination: {
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export function StoreFront({ initialProducts, categories, pagination }: StoreFrontProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { formatUSD } = useCurrency();
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isCategoryMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isCategoryMenuOpen]);

    const activeCategory = searchParams.get('category');
    const sortBy = searchParams.get('sort') || 'newest';

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Reset to page 1 if changing category, sort, or search
        if (!updates.page && (updates.category !== undefined || updates.sort !== undefined)) {
            params.set('page', '1');
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Helper to check if a category or its children is active
    const isCategoryActive = (cat: any) => {
        if (activeCategory === cat.id) return true;
        if (cat.children?.some((c: any) => c.id === activeCategory)) return true;
        return false;
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Filter Bar - Non-sticky */}
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl">

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsCategoryMenuOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--accent-primary))] text-white font-medium w-full justify-center"
                >
                    <ChevronDown size={18} />
                    Categorías
                </button>

                {/* Categories Navigation - Hidden on mobile, visible on desktop */}
                <div className="hidden lg:flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button
                        onClick={() => updateParams({ category: null })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${!activeCategory
                            ? 'bg-[hsl(var(--accent-primary))] text-white shadow-lg shadow-[hsl(var(--accent-primary))]/20'
                            : 'bg-white/5 hover:bg-white/10 text-[hsl(var(--text-secondary))]'
                            }`}
                    >
                        Todos
                    </button>

                    {categories.map((cat) => (
                        <div key={cat.id} className="relative group">
                            <button
                                onClick={() => updateParams({ category: cat.id })}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isCategoryActive(cat)
                                    ? 'bg-[hsl(var(--accent-primary))] text-white shadow-lg shadow-[hsl(var(--accent-primary))]/20'
                                    : 'bg-white/5 hover:bg-white/10 text-[hsl(var(--text-secondary))] group-hover:bg-white/10'
                                    }`}
                            >
                                {cat.name}
                                {cat.children && cat.children.length > 0 && (
                                    <ChevronDown size={14} className="opacity-70 group-hover:translate-y-0.5 transition-transform" />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {cat.children && cat.children.length > 0 && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top group-hover:translate-y-0 translate-y-2">
                                    <div className="p-1">
                                        {cat.children.map((child: any) => (
                                            <button
                                                key={child.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateParams({ category: child.id });
                                                }}
                                                className={`text-left w-full px-3 py-2 text-sm rounded-lg transition-colors ${activeCategory === child.id
                                                    ? 'bg-[hsl(var(--accent-primary))]/10 text-[hsl(var(--accent-primary))]'
                                                    : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}
                                            >
                                                {child.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Category Drawer */}
                {isCategoryMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        <div className="absolute inset-0 bg-black" onClick={() => setIsCategoryMenuOpen(false)} />
                        <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-[#0d0d0d] border-r-2 border-[hsl(var(--accent-primary))]/40 p-6 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col overflow-y-auto">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/20">
                                <span className="text-xl font-black tracking-tighter gradient-text">CATEGORÍAS</span>
                                <button
                                    onClick={() => setIsCategoryMenuOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </div>

                            <div className="space-y-2 flex-1">
                                <button
                                    onClick={() => {
                                        updateParams({ category: null });
                                        setIsCategoryMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${!activeCategory
                                        ? 'bg-[hsl(var(--accent-primary))] text-white'
                                        : 'bg-white/10 text-[hsl(var(--text-secondary))] hover:bg-white/15 hover:text-white'
                                        }`}
                                >
                                    Todos
                                </button>

                                {categories.map((cat) => (
                                    <div key={cat.id} className="space-y-1">
                                        <button
                                            onClick={() => {
                                                updateParams({ category: cat.id });
                                                setIsCategoryMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${isCategoryActive(cat)
                                                ? 'bg-[hsl(var(--accent-primary))]/20 text-[hsl(var(--accent-primary))] border border-[hsl(var(--accent-primary))]/40'
                                                : 'text-[hsl(var(--text-secondary))] hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {cat.name}
                                            {cat.children && cat.children.length > 0 && (
                                                <ChevronDown size={16} className={`transition-transform ${isCategoryActive(cat) ? 'rotate-180' : ''}`} />
                                            )}
                                        </button>

                                        {cat.children && cat.children.length > 0 && (
                                            <div className="pl-4 space-y-1 mt-1 border-l border-white/10 ml-4">
                                                {cat.children.map((child: any) => (
                                                    <button
                                                        key={child.id}
                                                        onClick={() => {
                                                            updateParams({ category: child.id });
                                                            setIsCategoryMenuOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeCategory === child.id
                                                            ? 'text-[hsl(var(--accent-primary))] font-bold'
                                                            : 'text-[hsl(var(--text-tertiary))] hover:text-white'
                                                            }`}
                                                    >
                                                        {child.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Sort Controls */}
                <div className="flex items-center gap-4 w-full lg:w-auto pb-2 lg:pb-0">
                    <div className="relative flex-1 lg:flex-none w-full">
                        <select
                            value={sortBy}
                            onChange={(e) => updateParams({ sort: e.target.value })}
                            className="w-full lg:w-48 appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-colors cursor-pointer"
                        >
                            <option value="newest" className="bg-[#09090b]">Los más nuevos</option>
                            <option value="price_asc" className="bg-[#09090b]">Precio: bajo a alto</option>
                            <option value="price_desc" className="bg-[#09090b]">Precio: alto a bajo</option>
                            <option value="name_asc" className="bg-[#09090b]">Nombre: A-Z</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[hsl(var(--text-secondary))]" />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                {initialProducts.length > 0 ? (
                    initialProducts.map((product, idx) => (
                        <div
                            key={product.id}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center glass-card border-dashed">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <X size={40} className="text-[hsl(var(--text-tertiary))]" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No hay productos</h2>
                        <p className="text-[hsl(var(--text-secondary))]">Intenta con otros filtros o categoría.</p>
                        <button
                            onClick={() => updateParams({ category: null, sort: 'newest', page: '1' })}
                            className="mt-6 btn btn-outline btn-sm"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pb-12">
                    <button
                        onClick={() => updateParams({ page: String(pagination.currentPage - 1) })}
                        disabled={pagination.currentPage <= 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span className="text-sm font-medium text-[color:var(--text-secondary)]">
                        Página <span className="text-[color:var(--text-primary)]">{pagination.currentPage}</span> de {pagination.totalPages}
                    </span>

                    <button
                        onClick={() => updateParams({ page: String(pagination.currentPage + 1) })}
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

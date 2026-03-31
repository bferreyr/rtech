'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { SearchBar } from '@/components/product/SearchBar';
import { MobileFilterModal } from '@/components/product/MobileFilterModal';
import { ChevronDown, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
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
    availableFilters?: {
        brands: { name: string; count: number }[];
        priceRange: { min: number; max: number };
        categories: any[];
    };
}

export function StoreFront({ initialProducts, categories, pagination, availableFilters }: StoreFrontProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { formatUSD } = useCurrency();
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isCategoryMenuOpen || isFilterMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isCategoryMenuOpen, isFilterMenuOpen]);

    const activeCategory = searchParams.get('category');
    const sortBy = searchParams.get('sort') || 'price_asc';
    const searchQuery = searchParams.get('search') || '';

    // Parse active filters from URL
    const activeFilters = {
        brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
        priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
        priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
        inStock: searchParams.get('inStock') === 'true' || undefined,
        category: searchParams.get('category') || undefined,
    };

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Reset to page 1 if changing filters
        if (!updates.page && Object.keys(updates).some(k => k !== 'page')) {
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

    // Handle filter changes
    const handleFilterChange = (filters: any) => {
        const updates: Record<string, string | null> = {};

        if (filters.brands && filters.brands.length > 0) {
            updates.brands = filters.brands.join(',');
        } else {
            updates.brands = null;
        }

        if (filters.priceMin !== undefined) {
            updates.priceMin = String(filters.priceMin);
        } else {
            updates.priceMin = null;
        }

        if (filters.priceMax !== undefined) {
            updates.priceMax = String(filters.priceMax);
        } else {
            updates.priceMax = null;
        }

        if (filters.inStock) {
            updates.inStock = 'true';
        } else {
            updates.inStock = null;
        }

        if (filters.category) {
            updates.category = filters.category;
        } else {
            updates.category = null;
        }

        updateParams(updates);
    };

    // Handle search
    const handleSearch = (query: string) => {
        updateParams({ search: query || null });
    };

    // Count active filters
    const activeFilterCount = [
        activeFilters.brands.length > 0,
        activeFilters.priceMin !== undefined,
        activeFilters.priceMax !== undefined,
        activeFilters.inStock,
    ].filter(Boolean).length;

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filter Sidebar */}
            {availableFilters && (
                <div className="hidden lg:block">
                    <FilterSidebar
                        filters={availableFilters}
                        activeFilters={activeFilters}
                        onFilterChange={handleFilterChange}
                    />
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-8">
                {/* Search Bar */}
                <div className="px-4">
                    <SearchBar
                        initialQuery={searchQuery}
                        onSearch={handleSearch}
                        placeholder="Buscar productos, marcas, SKU..."
                    />
                </div>

                {/* Mobile Filter Button */}
                {availableFilters && (
                    <div className="lg:hidden px-4">
                        <button
                            onClick={() => setIsFilterMenuOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span>Filtros</span>
                            {activeFilterCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--accent-primary))] text-xs font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>
                )}

                {/* Active Filters Pills */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2 px-4">
                        {activeFilters.brands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => handleFilterChange({
                                    ...activeFilters,
                                    brands: activeFilters.brands.filter(b => b !== brand)
                                })}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(var(--accent-primary))]/20 border border-[hsl(var(--accent-primary))]/40 text-sm hover:bg-[hsl(var(--accent-primary))]/30 transition-colors"
                            >
                                <span>{brand}</span>
                                <X className="w-3 h-3" />
                            </button>
                        ))}
                        {(activeFilters.priceMin !== undefined || activeFilters.priceMax !== undefined) && (
                            <button
                                onClick={() => handleFilterChange({
                                    ...activeFilters,
                                    priceMin: undefined,
                                    priceMax: undefined
                                })}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(var(--accent-primary))]/20 border border-[hsl(var(--accent-primary))]/40 text-sm hover:bg-[hsl(var(--accent-primary))]/30 transition-colors"
                            >
                                <span>
                                    {formatUSD(activeFilters.priceMin || 0)} - {formatUSD(activeFilters.priceMax || 1000)}
                                </span>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                        {activeFilters.inStock && (
                            <button
                                onClick={() => handleFilterChange({
                                    ...activeFilters,
                                    inStock: undefined
                                })}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(var(--accent-primary))]/20 border border-[hsl(var(--accent-primary))]/40 text-sm hover:bg-[hsl(var(--accent-primary))]/30 transition-colors"
                            >
                                <span>Con stock</span>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}

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
                    <div className="flex items-center gap-4 w-full lg:w-auto pb-2 lg:pb-0 overflow-x-auto">
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            {[
                                { value: 'newest', label: 'Los más nuevos' },
                                { value: 'price_asc', label: 'Precio: bajo a alto' },
                                { value: 'price_desc', label: 'Precio: alto a bajo' },
                                { value: 'name_asc', label: 'Nombre: A-Z' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateParams({ sort: option.value })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${sortBy === option.value
                                            ? 'bg-[hsl(var(--accent-primary))] text-white shadow-lg'
                                            : 'text-[hsl(var(--text-secondary))] hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
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
                                onClick={() => updateParams({ category: null, sort: 'price_asc', page: '1' })}
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

            {/* Mobile Filter Modal */}
            {availableFilters && (
                <MobileFilterModal
                    isOpen={isFilterMenuOpen}
                    onClose={() => setIsFilterMenuOpen(false)}
                    filters={availableFilters}
                    activeFilters={activeFilters}
                    onFilterChange={(filters) => {
                        handleFilterChange(filters);
                        setIsFilterMenuOpen(false);
                    }}
                />
            )}
        </div>
    );
}

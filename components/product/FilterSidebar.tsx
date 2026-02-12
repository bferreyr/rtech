'use client';

import { PriceRangeFilter } from './filters/PriceRangeFilter';
import { BrandFilter } from './filters/BrandFilter';
import { CategoryFilter } from './filters/CategoryFilter';
import { X, SlidersHorizontal } from 'lucide-react';

interface Brand {
    name: string;
    count: number;
}

interface Category {
    id: string;
    name: string;
    productCount: number;
    children?: Category[];
}

interface AvailableFilters {
    brands: Brand[];
    priceRange: {
        min: number;
        max: number;
    };
    categories: Category[];
}

interface ActiveFilters {
    brands?: string[];
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
    category?: string;
}

interface FilterSidebarProps {
    filters: AvailableFilters;
    activeFilters: ActiveFilters;
    onFilterChange: (filters: ActiveFilters) => void;
}

export function FilterSidebar({ filters, activeFilters, onFilterChange }: FilterSidebarProps) {
    const hasActiveFilters =
        (activeFilters.brands && activeFilters.brands.length > 0) ||
        activeFilters.priceMin !== undefined ||
        activeFilters.priceMax !== undefined ||
        activeFilters.inStock;

    const clearFilters = () => {
        onFilterChange({});
    };

    return (
        <aside className="w-full lg:w-64 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
                    <h2 className="text-lg font-bold text-[hsl(var(--text-primary))]">Filtros</h2>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-[hsl(var(--accent-primary))] hover:underline flex items-center gap-1"
                    >
                        <X className="w-4 h-4" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Filter Sections */}
            <div className="space-y-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                {/* Price Range Filter */}
                <PriceRangeFilter
                    min={filters.priceRange.min}
                    max={filters.priceRange.max}
                    value={[
                        activeFilters.priceMin ?? filters.priceRange.min,
                        activeFilters.priceMax ?? filters.priceRange.max
                    ]}
                    onChange={(range) =>
                        onFilterChange({
                            ...activeFilters,
                            priceMin: range[0] === filters.priceRange.min ? undefined : range[0],
                            priceMax: range[1] === filters.priceRange.max ? undefined : range[1]
                        })
                    }
                />

                <div className="border-t border-white/10 my-4" />

                {/* Brand Filter */}
                <BrandFilter
                    brands={filters.brands}
                    selected={activeFilters.brands || []}
                    onChange={(brands) =>
                        onFilterChange({
                            ...activeFilters,
                            brands: brands.length > 0 ? brands : undefined
                        })
                    }
                />

                <div className="border-t border-white/10 my-4" />

                {/* Category Filter */}
                {filters.categories && filters.categories.length > 0 && (
                    <>
                        <CategoryFilter
                            categories={filters.categories}
                            selected={activeFilters.category}
                            onChange={(category) =>
                                onFilterChange({
                                    ...activeFilters,
                                    category: category || undefined
                                })
                            }
                        />

                        <div className="border-t border-white/10 my-4" />
                    </>
                )}

                {/* In Stock Toggle */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-[hsl(var(--text-primary))]">Disponibilidad</h3>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group">
                        <input
                            type="checkbox"
                            checked={activeFilters.inStock || false}
                            onChange={(e) =>
                                onFilterChange({
                                    ...activeFilters,
                                    inStock: e.target.checked || undefined
                                })
                            }
                            className="w-4 h-4 rounded border-white/20 text-[hsl(var(--accent-primary))] focus:ring-[hsl(var(--accent-primary))] focus:ring-offset-0"
                        />
                        <span className="text-sm text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))] transition-colors">
                            Solo con stock
                        </span>
                    </label>
                </div>
            </div>

            {/* Active Filters Count */}
            {hasActiveFilters && (
                <div className="p-3 bg-[hsl(var(--accent-primary))]/10 border border-[hsl(var(--accent-primary))]/20 rounded-xl">
                    <p className="text-sm text-[hsl(var(--accent-primary))]">
                        {(() => {
                            let count = 0;
                            if (activeFilters.brands && activeFilters.brands.length > 0) count += activeFilters.brands.length;
                            if (activeFilters.priceMin !== undefined || activeFilters.priceMax !== undefined) count++;
                            if (activeFilters.inStock) count++;
                            return `${count} filtro${count !== 1 ? 's' : ''} activo${count !== 1 ? 's' : ''}`;
                        })()}
                    </p>
                </div>
            )}
        </aside>
    );
}

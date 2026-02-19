'use client';

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
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                {/* Category Filter */}
                {filters.categories && filters.categories.length > 0 ? (
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
                ) : (
                    <p className="text-sm text-[hsl(var(--text-tertiary))]">No hay categorías disponibles</p>
                )}
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

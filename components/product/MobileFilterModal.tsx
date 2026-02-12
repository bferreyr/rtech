'use client';

import { FilterSidebar } from './FilterSidebar';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface MobileFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        brands: { name: string; count: number }[];
        priceRange: { min: number; max: number };
        categories: { id: string; name: string; productCount: number; children?: any[] }[];
    };
    activeFilters: {
        brands?: string[];
        priceMin?: number;
        priceMax?: number;
        inStock?: boolean;
        categoryId?: string;
    };
    onFilterChange: (filters: any) => void;
}

export function MobileFilterModal({
    isOpen,
    onClose,
    filters,
    activeFilters,
    onFilterChange
}: MobileFilterModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#09090b] border-l border-white/10 z-50 lg:hidden overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#09090b] border-b border-white/10 p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-[hsl(var(--text-primary))]">Filtros</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filter Content */}
                <div className="p-4">
                    <FilterSidebar
                        filters={filters}
                        activeFilters={activeFilters}
                        onFilterChange={onFilterChange}
                    />
                </div>

                {/* Footer with Apply Button */}
                <div className="sticky bottom-0 bg-[#09090b] border-t border-white/10 p-4">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent-primary))]/90 text-white font-semibold rounded-xl transition-colors"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </>
    );
}

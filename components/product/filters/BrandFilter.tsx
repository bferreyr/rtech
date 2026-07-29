'use client';

import { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';

interface Brand {
    name: string;
    count: number;
}

interface BrandFilterProps {
    brands: Brand[];
    selected?: string[];
    onChange: (brands: string[]) => void;
}

export function BrandFilter({ brands, selected = [], onChange }: BrandFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return brands;
        const query = searchQuery.toLowerCase();
        return brands.filter(b => b.name.toLowerCase().includes(query));
    }, [brands, searchQuery]);

    const toggleBrand = (brandName: string) => {
        if (selected.includes(brandName)) {
            onChange(selected.filter(b => b !== brandName));
        } else {
            onChange([...selected, brandName]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[hsl(var(--text-primary))]">Marcas</h3>
                {selected.length > 0 && (
                    <button
                        onClick={() => onChange([])}
                        className="text-xs text-[hsl(var(--accent-primary))] hover:underline"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* Search Bar */}
            {brands.length > 5 && (
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-tertiary))] group-focus-within:text-[hsl(var(--accent-primary))] transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar marca..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
                            w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-8 text-sm text-[hsl(var(--text-primary))]
                            placeholder-[hsl(var(--text-tertiary))]
                            focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))]
                            transition-all
                        "
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-[hsl(var(--text-tertiary))]" />
                        </button>
                    )}
                </div>
            )}

            {/* Brands List */}
            <div className="space-y-1 max-h-[240px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                {filteredBrands.map((brand) => {
                    const isSelected = selected.includes(brand.name);
                    return (
                        <div
                            key={brand.name}
                            onClick={() => toggleBrand(brand.name)}
                            className="group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                                    w-4 h-4 rounded border flex items-center justify-center transition-colors
                                    ${isSelected 
                                        ? 'bg-[hsl(var(--accent-primary))] border-[hsl(var(--accent-primary))] text-white' 
                                        : 'border-white/20 group-hover:border-[hsl(var(--accent-primary))]/50'}
                                `}>
                                    {isSelected && <Check className="w-3 h-3" />}
                                </div>
                                <span className={`text-sm transition-colors ${isSelected ? 'text-[hsl(var(--text-primary))] font-medium' : 'text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]'}`}>
                                    {brand.name}
                                </span>
                            </div>
                            <span className="text-xs text-[hsl(var(--text-tertiary))]">
                                {brand.count}
                            </span>
                        </div>
                    );
                })}
                
                {filteredBrands.length === 0 && (
                    <div className="py-4 text-center">
                        <p className="text-sm text-[hsl(var(--text-tertiary))]">No se encontraron marcas</p>
                    </div>
                )}
            </div>
        </div>
    );
}

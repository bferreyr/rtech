'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface Brand {
    name: string;
    count: number;
}

interface BrandFilterProps {
    brands: Brand[];
    selected: string[];
    onChange: (brands: string[]) => void;
}

export function BrandFilter({ brands, selected, onChange }: BrandFilterProps) {
    const [search, setSearch] = useState('');
    const [showAll, setShowAll] = useState(false);

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    const displayedBrands = showAll ? filteredBrands : filteredBrands.slice(0, 8);

    const toggleBrand = (brand: string) => {
        if (selected.includes(brand)) {
            onChange(selected.filter(b => b !== brand));
        } else {
            onChange([...selected, brand]);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-[hsl(var(--text-primary))]">Marca</h3>

            {/* Search */}
            {brands.length > 8 && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-tertiary))]" />
                    <input
                        type="text"
                        placeholder="Buscar marca..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors"
                    />
                </div>
            )}

            {/* Brand List */}
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                {displayedBrands.map((brand) => (
                    <label
                        key={brand.name}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group"
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(brand.name)}
                            onChange={() => toggleBrand(brand.name)}
                            className="w-4 h-4 rounded border-white/20 text-[hsl(var(--accent-primary))] focus:ring-[hsl(var(--accent-primary))] focus:ring-offset-0"
                        />
                        <span className="flex-1 text-sm text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))] transition-colors">
                            {brand.name}
                        </span>
                        <span className="text-xs text-[hsl(var(--text-tertiary))]">({brand.count})</span>
                    </label>
                ))}
            </div>

            {/* Show More */}
            {filteredBrands.length > 8 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-[hsl(var(--accent-primary))] hover:underline"
                >
                    {showAll ? 'Ver menos' : `Ver todas (${filteredBrands.length})`}
                </button>
            )}

            {/* No Results */}
            {filteredBrands.length === 0 && (
                <p className="text-sm text-[hsl(var(--text-tertiary))] text-center py-4">
                    No se encontraron marcas
                </p>
            )}
        </div>
    );
}

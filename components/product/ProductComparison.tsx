'use client';

import { useComparison } from '@/context/ComparisonContext';
import { useCurrency } from '@/context/CurrencyContext';
import { X, Check, Minus } from 'lucide-react';
import Image from 'next/image';

export function ProductComparison() {
    const { comparisonProducts, removeFromComparison, clearComparison } = useComparison();
    const { formatUSD, formatARS } = useCurrency();

    if (comparisonProducts.length === 0) {
        return null;
    }

    // Extract all unique specification keys
    const allSpecs = new Set<string>();
    comparisonProducts.forEach(product => {
        if (product.especificaciones && typeof product.especificaciones === 'object') {
            Object.keys(product.especificaciones).forEach(key => allSpecs.add(key));
        }
    });

    const specKeys = Array.from(allSpecs);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#09090b] border-t border-white/10 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#09090b] border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[hsl(var(--text-primary))]">
                        Comparar Productos ({comparisonProducts.length}/4)
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={clearComparison}
                        className="px-4 py-2 text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
                    >
                        Limpiar todo
                    </button>
                    <button
                        onClick={clearComparison}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="sticky left-0 bg-[#09090b] p-4 text-left text-sm font-semibold text-[hsl(var(--text-secondary))] border-r border-white/10 min-w-[200px]">
                                Característica
                            </th>
                            {comparisonProducts.map((product) => (
                                <th key={product.id} className="p-4 min-w-[250px] border-r border-white/10">
                                    <div className="space-y-3">
                                        {/* Product Image */}
                                        <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[hsl(var(--text-tertiary))]">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Name */}
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-[hsl(var(--text-primary))] line-clamp-2">
                                                {product.name}
                                            </p>
                                            {product.marca && (
                                                <p className="text-xs text-[hsl(var(--text-tertiary))]">
                                                    {product.marca}
                                                </p>
                                            )}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromComparison(product.id)}
                                            className="w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Price Row */}
                        <tr className="border-t border-white/10">
                            <td className="sticky left-0 bg-[#09090b] p-4 font-semibold text-[hsl(var(--text-primary))] border-r border-white/10">
                                Precio
                            </td>
                            {comparisonProducts.map((product) => (
                                <td key={product.id} className="p-4 border-r border-white/10">
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-[hsl(var(--accent-primary))]">
                                            {formatUSD(product.price)}
                                        </p>
                                        <p className="text-sm text-[hsl(var(--text-tertiary))]">
                                            {formatARS(product.price)}
                                        </p>
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Stock Row */}
                        <tr className="border-t border-white/10">
                            <td className="sticky left-0 bg-[#09090b] p-4 font-semibold text-[hsl(var(--text-primary))] border-r border-white/10">
                                Disponibilidad
                            </td>
                            {comparisonProducts.map((product) => (
                                <td key={product.id} className="p-4 border-r border-white/10">
                                    {product.stock > 0 ? (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <Check className="w-4 h-4" />
                                            <span className="text-sm">En stock ({product.stock})</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-400">
                                            <X className="w-4 h-4" />
                                            <span className="text-sm">Sin stock</span>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* Model Row */}
                        {comparisonProducts.some(p => p.modelo) && (
                            <tr className="border-t border-white/10">
                                <td className="sticky left-0 bg-[#09090b] p-4 font-semibold text-[hsl(var(--text-primary))] border-r border-white/10">
                                    Modelo
                                </td>
                                {comparisonProducts.map((product) => (
                                    <td key={product.id} className="p-4 text-sm text-[hsl(var(--text-secondary))] border-r border-white/10">
                                        {product.modelo || <Minus className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />}
                                    </td>
                                ))}
                            </tr>
                        )}

                        {/* Specifications Rows */}
                        {specKeys.map((specKey) => (
                            <tr key={specKey} className="border-t border-white/10">
                                <td className="sticky left-0 bg-[#09090b] p-4 font-semibold text-[hsl(var(--text-primary))] border-r border-white/10">
                                    {specKey}
                                </td>
                                {comparisonProducts.map((product) => {
                                    const value = product.especificaciones?.[specKey];
                                    return (
                                        <td key={product.id} className="p-4 text-sm text-[hsl(var(--text-secondary))] border-r border-white/10">
                                            {value || <Minus className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

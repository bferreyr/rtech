'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    productCount: number;
    children?: Category[];
}

interface CategoryFilterProps {
    categories: Category[];
    selected?: string;
    onChange: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleExpanded = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const renderCategory = (category: Category, level: number = 0) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category.id);
        const isSelected = selected === category.id;

        return (
            <div key={category.id} className="space-y-1">
                <div
                    className={`flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors ${level > 0 ? 'ml-4' : ''
                        }`}
                    style={{ paddingLeft: `${level * 12}px` }}
                >
                    {/* Expand/Collapse Button */}
                    {hasChildren ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(category.id);
                            }}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
                            )}
                        </button>
                    ) : (
                        <div className="w-6" /> // Spacer for alignment
                    )}

                    {/* Category Label */}
                    <label
                        className="flex-1 flex items-center justify-between cursor-pointer py-2 pr-2 group"
                        onClick={() => onChange(isSelected ? null : category.id)}
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => onChange(isSelected ? null : category.id)}
                                className="w-4 h-4 text-[hsl(var(--accent-primary))] focus:ring-[hsl(var(--accent-primary))] focus:ring-offset-0"
                            />
                            <span
                                className={`text-sm transition-colors ${isSelected
                                        ? 'text-[hsl(var(--accent-primary))] font-semibold'
                                        : 'text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]'
                                    }`}
                            >
                                {category.name}
                            </span>
                        </div>
                        <span className="text-xs text-[hsl(var(--text-tertiary))]">
                            ({category.productCount})
                        </span>
                    </label>
                </div>

                {/* Children Categories */}
                {hasChildren && isExpanded && (
                    <div className="space-y-1">
                        {category.children!.map((child) => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-[hsl(var(--text-primary))]">Categorías</h3>

            {/* All Categories Option */}
            <label
                className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group"
                onClick={() => onChange(null)}
            >
                <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={!selected}
                        onChange={() => onChange(null)}
                        className="w-4 h-4 text-[hsl(var(--accent-primary))] focus:ring-[hsl(var(--accent-primary))] focus:ring-offset-0"
                    />
                    <span
                        className={`text-sm transition-colors ${!selected
                                ? 'text-[hsl(var(--accent-primary))] font-semibold'
                                : 'text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]'
                            }`}
                    >
                        Todas las categorías
                    </span>
                </div>
            </label>

            {/* Category Tree */}
            <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
                {categories.map((category) => renderCategory(category, 0))}
            </div>

            {/* No Categories */}
            {categories.length === 0 && (
                <p className="text-sm text-[hsl(var(--text-tertiary))] text-center py-4">
                    No hay categorías disponibles
                </p>
            )}
        </div>
    );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState('');

    // Filter categories based on search query
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;

        const query = searchQuery.toLowerCase();

        const filterTree = (cats: Category[]): Category[] => {
            return cats.reduce((acc: Category[], cat) => {
                const matches = cat.name.toLowerCase().includes(query);
                const filteredChildren = cat.children ? filterTree(cat.children) : [];

                if (matches || filteredChildren.length > 0) {
                    acc.push({
                        ...cat,
                        children: filteredChildren.length > 0 ? filteredChildren : undefined,
                    });
                }
                return acc;
            }, []);
        };

        return filterTree(categories);
    }, [categories, searchQuery]);

    // Auto-expand categories when searching or when a category is selected
    useEffect(() => {
        if (searchQuery.trim()) {
            const allIds = new Set<string>();
            const collectIds = (cats: Category[]) => {
                cats.forEach(cat => {
                    allIds.add(cat.id);
                    if (cat.children) collectIds(cat.children);
                });
            };
            collectIds(filteredCategories);
            setExpandedCategories(allIds);
        }
    }, [searchQuery, filteredCategories]);

    // Auto-expand path to selected category on mount
    useEffect(() => {
        if (selected && !searchQuery) {
            const path = new Set<string>();
            const findPath = (cats: Category[], targetId: string): boolean => {
                for (const cat of cats) {
                    if (cat.id === targetId) return true;
                    if (cat.children && findPath(cat.children, targetId)) {
                        path.add(cat.id);
                        return true;
                    }
                }
                return false;
            };
            findPath(categories, selected);
            setExpandedCategories(prev => {
                const next = new Set(prev);
                path.forEach(id => next.add(id));
                return next;
            });
        }
    }, [selected, categories, searchQuery]);

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
        const matchesSearch = searchQuery && category.name.toLowerCase().includes(searchQuery.toLowerCase());

        return (
            <div key={category.id} className="select-none">
                <div
                    className={`
                        group flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected ? 'bg-[hsl(var(--accent-primary))]/10' : 'hover:bg-white/5'}
                    `}
                    style={{ paddingLeft: `${(level * 12) + 8}px` }}
                    onClick={() => onChange(isSelected ? null : category.id)}
                >
                    {/* Expand/Collapse Button */}
                    <div
                        className={`
                            flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors
                            ${hasChildren ? 'hover:bg-white/10 cursor-pointer' : 'opacity-0 pointer-events-none'}
                        `}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (hasChildren) toggleExpanded(category.id);
                        }}
                    >
                        {hasChildren && (
                            isExpanded ?
                                <ChevronDown className="w-3.5 h-3.5 text-[hsl(var(--text-tertiary))]" /> :
                                <ChevronRight className="w-3.5 h-3.5 text-[hsl(var(--text-tertiary))]" />
                        )}
                    </div>

                    {/* Category Label */}
                    <div className="flex-1 flex items-center justify-between min-w-0">
                        <span
                            className={`
                                text-sm truncate transition-colors
                                ${isSelected
                                    ? 'text-[hsl(var(--accent-primary))] font-medium'
                                    : 'text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]'
                                }
                                ${matchesSearch ? 'bg-[hsl(var(--accent-primary))]/20 text-[hsl(var(--text-primary))] px-1 rounded -ml-1' : ''}
                            `}
                        >
                            {category.name}
                        </span>

                        {/* Count Badge */}
                        <span className={`
                            text-[10px] px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0 transition-colors
                            ${isSelected
                                ? 'bg-[hsl(var(--accent-primary))] text-white'
                                : 'bg-white/5 text-[hsl(var(--text-tertiary))] group-hover:bg-white/10'
                            }
                        `}>
                            {category.productCount}
                        </span>
                    </div>
                </div>

                {/* Children Categories */}
                {hasChildren && isExpanded && (
                    <div className="relative border-l border-white/5 ml-[17px]">
                        {category.children!.map((child) => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[hsl(var(--text-primary))]">Categorías</h3>
                {selected && (
                    <button
                        onClick={() => onChange(null)}
                        className="text-xs text-[hsl(var(--accent-primary))] hover:underline"
                    >
                        Ver todas
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-tertiary))] group-focus-within:text-[hsl(var(--accent-primary))] transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar categoría..."
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

            {/* Category Tree */}
            <div className="space-y-0.5 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                {!searchQuery && !selected && (
                    <div
                        className="
                            flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200
                            hover:bg-white/5 mb-2 group
                        "
                        onClick={() => onChange(null)}
                    >
                        <div className="w-5 h-5" /> {/* Alignment spacer */}
                        <span className="text-sm font-medium text-[hsl(var(--text-primary))] group-hover:text-[hsl(var(--accent-primary))] transition-colors">
                            Todas las categorías
                        </span>
                    </div>
                )}

                {filteredCategories.map((category) => renderCategory(category, 0))}

                {/* No Categories Found */}
                {filteredCategories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Search className="w-5 h-5 text-[hsl(var(--text-muted))]" />
                        </div>
                        <p className="text-sm font-medium text-[hsl(var(--text-secondary))]">
                            No encontramos categorías
                        </p>
                        <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">
                            Intenta con otro término
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

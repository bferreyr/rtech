'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    initialQuery?: string;
}

export function SearchBar({ onSearch, placeholder = "Buscar productos, marcas, SKU...", initialQuery = '' }: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const isFirstMount = useRef(true);
    const debouncedQuery = useDebounce(query, 300);

    // Load search history from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('searchHistory');
            if (saved) {
                try {
                    setHistory(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse search history');
                }
            }
        }
    }, []);

    // Trigger search when debounced query changes
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        // Ejecutamos la búsqueda con el string tipiado. Si está vacío, también buscará (y restablecerá).
        onSearch(debouncedQuery);
        
        // Desactivado onSearch de dependencias para evitar renders infinitos
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        onSearch(searchQuery);
        addToHistory(searchQuery);
        setShowHistory(false);
    };

    const addToHistory = (q: string) => {
        if (!q.trim()) return;

        const newHistory = [q, ...history.filter(h => h !== q)].slice(0, 5);
        setHistory(newHistory);

        if (typeof window !== 'undefined') {
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
    };

    const clearHistory = () => {
        setHistory([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('searchHistory');
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-tertiary))]" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowHistory(true)}
                    onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && query.trim()) {
                            handleSearch(query);
                        }
                    }}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors text-[hsl(var(--text-primary))]"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            onSearch('');
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
                    </button>
                )}
            </div>

            {/* Search History Dropdown */}
            {showHistory && history.length > 0 && !query && (
                <div className="absolute top-full mt-2 w-full bg-[#111] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-2">
                        <div className="flex items-center justify-between px-3 py-2">
                            <span className="text-xs text-[hsl(var(--text-tertiary))]">Búsquedas recientes</span>
                            <button
                                onClick={clearHistory}
                                className="text-xs text-[hsl(var(--accent-primary))] hover:underline"
                            >
                                Limpiar
                            </button>
                        </div>
                        {history.map((h, i) => (
                            <button
                                key={i}
                                onClick={() => handleSearch(h)}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left"
                            >
                                <Clock className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
                                <span className="text-sm text-[hsl(var(--text-secondary))]">{h}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

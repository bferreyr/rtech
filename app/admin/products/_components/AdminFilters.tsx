'use client';

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
    id: string;
    slug: string;
    name: string;
}

interface AdminFiltersProps {
    categories: Category[];
}

export function AdminFilters({ categories }: AdminFiltersProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search')?.toString() || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            if (searchTerm !== (searchParams.get('search') || '')) {
                params.set('page', '1');
                router.replace(`?${params.toString()}`);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, router, searchParams]);

    const handleCategoryChange = (categoryId: string) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId && categoryId !== 'all') {
            params.set('category', categoryId);
        } else {
            params.delete('category');
        }
        params.set('page', '1');
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-tertiary))]" size={18} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, SKU, marca..."
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="min-w-[200px]">
                <select
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-colors appearance-none cursor-pointer"
                    defaultValue={searchParams.get('category')?.toString() || 'all'}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="all">Todas las categorías</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="min-w-[140px]">
                <select
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-colors appearance-none cursor-pointer"
                    defaultValue={searchParams.get('limit')?.toString() || '10'}
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams);
                        params.set('limit', e.target.value);
                        params.set('page', '1');
                        router.replace(`?${params.toString()}`);
                    }}
                >
                    <option value="10">10 por pág</option>
                    <option value="20">20 por pág</option>
                    <option value="50">50 por pág</option>
                    <option value="100">100 por pág</option>
                </select>
            </div>
        </div>
    );
}

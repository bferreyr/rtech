'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Link
                href={createPageURL(Math.max(1, currentPage - 1))}
                className={`p-2 rounded-lg border border-white/10 transition-colors ${currentPage <= 1
                    ? 'pointer-events-none opacity-50 text-[hsl(var(--text-tertiary))]'
                    : 'hover:bg-white/5 text-[hsl(var(--text-secondary))]'
                    }`}
                aria-disabled={currentPage <= 1}
            >
                <ChevronLeft size={20} />
            </Link>

            <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Simple logic to show window around current page
                    let p = i + 1;
                    if (totalPages > 5) {
                        if (currentPage > 3) p = currentPage - 2 + i;
                        if (p > totalPages) p = totalPages - (4 - i);
                    }

                    if (p <= 0) return null; // Should not happen with logic above but safety

                    const isActive = currentPage === p;
                    return (
                        <Link
                            key={p}
                            href={createPageURL(p)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all font-medium ${isActive
                                    ? 'bg-[hsl(var(--accent-primary))] border-[hsl(var(--accent-primary))] text-white scale-105 shadow-lg shadow-[hsl(var(--accent-primary))]/20'
                                    : 'border-white/10 hover:bg-white/5 text-[hsl(var(--text-secondary))]'
                                }`}
                        >
                            {p}
                        </Link>
                    );
                })}
            </div>

            <Link
                href={createPageURL(Math.min(totalPages, currentPage + 1))}
                className={`p-2 rounded-lg border border-white/10 transition-colors ${currentPage >= totalPages
                    ? 'pointer-events-none opacity-50 text-[hsl(var(--text-tertiary))]'
                    : 'hover:bg-white/5 text-[hsl(var(--text-secondary))]'
                    }`}
                aria-disabled={currentPage >= totalPages}
            >
                <ChevronRight size={20} />
            </Link>
        </div>
    );
}

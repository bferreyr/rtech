'use client';

import { StarRating } from './StarRating';
import { ShieldCheck } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
    };
}

interface ReviewListProps {
    reviews: Review[];
    totalCount: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

export function ReviewList({
    reviews,
    totalCount,
    currentPage = 1,
    onPageChange,
}: ReviewListProps) {
    const reviewsPerPage = 10;
    const totalPages = Math.ceil(totalCount / reviewsPerPage);

    if (reviews.length === 0) {
        return (
            <div className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] p-12 text-center">
                <p className="text-[color:var(--text-tertiary)] text-lg">
                    No hay reseñas todavía. ¡Sé el primero en dejar una!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] p-6 backdrop-blur-xl hover:border-[hsl(var(--accent-primary))]/30 transition-colors"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <StarRating rating={review.rating} readonly size="sm" />
                                {review.isVerifiedPurchase && (
                                    <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                        <ShieldCheck size={12} />
                                        <span>Compra Verificada</span>
                                    </div>
                                )}
                            </div>
                            <h4 className="font-semibold text-[color:var(--text-primary)] text-lg">
                                {review.title}
                            </h4>
                        </div>
                    </div>

                    {/* Comment */}
                    <p className="text-[color:var(--text-secondary)] leading-relaxed mb-4">
                        {review.comment}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-sm text-[color:var(--text-tertiary)]">
                        <span className="font-medium">
                            {review.user.name || 'Usuario Anónimo'}
                        </span>
                        <span>•</span>
                        <span>
                            {new Date(review.createdAt).toLocaleDateString('es-AR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && onPageChange && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] text-[color:var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[hsl(var(--accent-primary))]/50 transition-colors"
                    >
                        Anterior
                    </button>

                    <span className="text-sm text-[color:var(--text-secondary)]">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] text-[color:var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[hsl(var(--accent-primary))]/50 transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

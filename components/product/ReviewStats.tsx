'use client';

import { StarRating } from './StarRating';

interface ReviewStatsProps {
    averageRating: number;
    totalReviews: number;
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export function ReviewStats({
    averageRating,
    totalReviews,
    distribution,
}: ReviewStatsProps) {
    const getPercentage = (count: number) => {
        if (totalReviews === 0) return 0;
        return (count / totalReviews) * 100;
    };

    return (
        <div className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-bold mb-6">Calificaciones de Clientes</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-5xl font-black bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={averageRating} readonly size="lg" />
                    <p className="text-sm text-[color:var(--text-tertiary)] mt-2">
                        Basado en {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = distribution[stars as keyof typeof distribution];
                        const percentage = getPercentage(count);

                        return (
                            <div key={stars} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-[color:var(--text-secondary)] w-12">
                                    {stars} {stars === 1 ? 'estrella' : 'estrellas'}
                                </span>
                                <div className="flex-1 h-2 bg-[color:var(--bg-primary)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-[color:var(--text-tertiary)] w-12 text-right">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

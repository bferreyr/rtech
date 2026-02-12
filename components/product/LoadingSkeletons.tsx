export function ProductCardSkeleton() {
    return (
        <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-square bg-white/5" />

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
                {/* Brand */}
                <div className="h-4 bg-white/5 rounded w-1/3" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-5 bg-white/5 rounded w-full" />
                    <div className="h-5 bg-white/5 rounded w-2/3" />
                </div>

                {/* Price */}
                <div className="h-8 bg-white/5 rounded w-1/2" />

                {/* Button */}
                <div className="h-12 bg-white/5 rounded-xl w-full" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function FilterSidebarSkeleton() {
    return (
        <aside className="w-full lg:w-64 space-y-6">
            {/* Header */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl animate-pulse">
                <div className="h-6 bg-white/5 rounded w-1/2" />
            </div>

            {/* Filter Sections */}
            <div className="space-y-6 p-4 bg-white/5 border border-white/10 rounded-xl animate-pulse">
                {/* Price Range */}
                <div className="space-y-3">
                    <div className="h-5 bg-white/5 rounded w-1/3" />
                    <div className="h-2 bg-white/5 rounded w-full" />
                    <div className="flex justify-between">
                        <div className="h-4 bg-white/5 rounded w-16" />
                        <div className="h-4 bg-white/5 rounded w-16" />
                    </div>
                </div>

                <div className="border-t border-white/10 my-4" />

                {/* Brands */}
                <div className="space-y-3">
                    <div className="h-5 bg-white/5 rounded w-1/3" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white/5 rounded" />
                            <div className="h-4 bg-white/5 rounded flex-1" />
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export function SearchBarSkeleton() {
    return (
        <div className="relative animate-pulse">
            <div className="h-12 bg-white/5 border border-white/10 rounded-xl" />
        </div>
    );
}

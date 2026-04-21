'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImage {
    url: string;
    order: number;
}

interface ProductImageGalleryProps {
    mainImageUrl: string | null;
    images: ProductImage[];
    productName: string;
}

export function ProductImageGallery({ mainImageUrl, images, productName }: ProductImageGalleryProps) {
    // Build the full list: main image first, then sorted additional images
    const allImages = [
        ...(mainImageUrl ? [{ url: mainImageUrl, order: -1 }] : []),
        ...images.sort((a, b) => a.order - b.order),
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [fadeKey, setFadeKey] = useState(0);

    const goTo = useCallback((index: number) => {
        if (index === activeIndex) return;
        setActiveIndex(index);
        setFadeKey(k => k + 1);
    }, [activeIndex]);

    const goPrev = () => goTo((activeIndex - 1 + allImages.length) % allImages.length);
    const goNext = () => goTo((activeIndex + 1) % allImages.length);

    if (allImages.length === 0) {
        return (
            <section
                aria-label="Galería de imágenes"
                className="aspect-square bg-[color:var(--bg-secondary)] rounded-xl overflow-hidden border border-[color:var(--border-color)] flex items-center justify-center text-[color:var(--text-tertiary)]"
            >
                No hay imagen disponible
            </section>
        );
    }

    const activeImage = allImages[activeIndex];
    const hasMultiple = allImages.length > 1;

    return (
        <section aria-label="Galería de imágenes" className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative aspect-square bg-[color:var(--bg-secondary)] rounded-xl overflow-hidden border border-[color:var(--border-color)] group">
                <img
                    key={fadeKey}
                    src={activeImage.url}
                    alt={`Vista detallada de ${productName}`}
                    className="object-contain w-full h-full transition-opacity duration-300"
                    style={{ animation: 'galleryFadeIn 0.3s ease' }}
                />

                {/* Navigation arrows */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={goPrev}
                            aria-label="Imagen anterior"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={goNext}
                            aria-label="Imagen siguiente"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Image counter */}
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                            {activeIndex + 1} / {allImages.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {hasMultiple && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {allImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => goTo(index)}
                            aria-label={`Ver imagen ${index + 1}`}
                            className={`
                                flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200
                                ${index === activeIndex
                                    ? 'border-[hsl(var(--accent-primary))] scale-105 shadow-lg'
                                    : 'border-[color:var(--border-color)] opacity-60 hover:opacity-100 hover:border-[color:var(--text-secondary)]'
                                }
                            `}
                        >
                            <img
                                src={img.url}
                                alt={`Miniatura ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fade-in keyframe injected inline */}
            <style>{`
                @keyframes galleryFadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </section>
    );
}

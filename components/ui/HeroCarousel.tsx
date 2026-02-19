'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingCart } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface CarouselSlide {
    id: string;
    title: string | null;
    imageUrl: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: number; // Base price (serialized or raw)
        stockTotal: number;
    };
    priceArs: number | null; // Decimal serialized to number
    priceUsd: number | null; // Decimal serialized to number
}

interface HeroCarouselProps {
    slides: CarouselSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { formatUSD, formatARS } = useCurrency(); // Assuming formatARS exists or we use raw
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length]);

    const nextSlide = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (!slides || slides.length === 0) return null;

    const currentSlide = slides[currentIndex];
    const product = currentSlide.product;

    return (
        <div className="relative h-[60vh] w-full overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[hsl(var(--bg-primary))]">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
                {/* Custom Banner Image */}
                <div
                    key={`bg-${currentSlide.id}`}
                    className="absolute inset-0 opacity-40 blur-md transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${currentSlide.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </div>

            <div className="container relative z-20 h-full flex items-center px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                    {/* Text Content */}
                    <div className="space-y-6 animate-in slide-in-from-left duration-700 fade-in pl-4 lg:pl-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent-primary))]/20 border border-[hsl(var(--accent-primary))]/40 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--accent-primary))]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent-primary))]">
                                {currentSlide.title || "OFERTA DESTACADA"}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight line-clamp-2 drop-shadow-lg">
                            {product.name}
                        </h1>

                        <p className="text-lg text-gray-200 line-clamp-2 max-w-xl drop-shadow-md">
                            {product.description}
                        </p>

                        <div className="flex flex-col gap-1">
                            {/* Price Display Logic */}
                            <div className="flex items-baseline gap-3">
                                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]">
                                    {currentSlide.priceUsd
                                        ? formatUSD(currentSlide.priceUsd)
                                        : formatUSD(Number(product.price))}
                                </div>
                                {currentSlide.priceArs && (
                                    <span className="text-xl text-gray-300 font-medium">
                                        ≈ ARS ${currentSlide.priceArs.toLocaleString('es-AR')}
                                    </span>
                                )}
                            </div>

                            {product.stockTotal > 0 && (
                                <span className="text-sm text-green-400 font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    En Stock
                                </span>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link
                                href={`/products/${product.id}`}
                                className="btn btn-primary px-8 py-4 text-lg rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.5)] transition-all"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Ver Oferta
                            </Link>
                        </div>
                    </div>

                    {/* Product Image (Optional - usually redundant with banner but good for emphasis) */}
                    {/* Only show if the banner isn't just the product image itself to avoid duplication visual, 
                        or maybe just hide this right column if we want full banner focus? 
                        Let's keep it for now as it adds depth. */}
                    <div className="hidden lg:flex relative h-[400px] lg:h-[500px] items-center justify-center animate-in zoom-in-95 duration-1000 fade-in delay-200">
                        {/* 
                           If the carousel image IS the product image, we might want to hide this 
                           but generally the carousel image is a "scene" or "banner" and this is the "cutout".
                        */}
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-white/10 border border-white/5 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-white/10 border border-white/5 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    setIsAutoPlaying(false);
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? 'w-8 bg-[hsl(var(--accent-primary))]'
                                        : 'bg-white/20 hover:bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

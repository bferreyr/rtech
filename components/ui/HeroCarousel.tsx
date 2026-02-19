'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingCart } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface HeroCarouselProps {
    products: any[];
}

export function HeroCarousel({ products }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { formatUSD } = useCurrency();
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, products.length]);

    const nextSlide = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    if (!products || products.length === 0) return null;

    const currentProduct = products[currentIndex];

    return (
        <div className="relative h-[60vh] w-full overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[hsl(var(--bg-primary))]">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
                {/* Blurred Background Image */}
                <div
                    key={`bg-${currentProduct.id}`}
                    className="absolute inset-0 opacity-30 blur-3xl transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${currentProduct.imageUrl})`,
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
                                OFERTA DESTACADA
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight line-clamp-2">
                            {currentProduct.name}
                        </h1>

                        <p className="text-lg text-gray-300 line-clamp-2 max-w-xl">
                            {currentProduct.description}
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]">
                                {formatUSD(currentProduct.price)}
                            </div>
                            {currentProduct.stockTotal && (
                                <span className="text-sm px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                                    En Stock
                                </span>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link
                                href={`/products/${currentProduct.id}`}
                                className="btn btn-primary px-8 py-4 text-lg rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.5)] transition-all"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Ver Oferta
                            </Link>
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center animate-in zoom-in-95 duration-1000 fade-in delay-200">
                        <div className="relative w-full h-full max-w-md aspect-square">
                            <div className="absolute inset-0 bg-[hsl(var(--accent-primary))]/20 blur-3xl rounded-full animate-pulse" />
                            <Image
                                src={currentProduct.imageUrl || '/placeholder.png'}
                                alt={currentProduct.name}
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-105"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
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

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {products.map((_, idx) => (
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
        </div>
    );
}

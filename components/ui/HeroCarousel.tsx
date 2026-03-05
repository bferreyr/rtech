'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingCart, Tag, Layers } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface CarouselSlide {
    id: string;
    title: string | null;
    imageUrl: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        stockTotal: number;
    };
    priceArs: number | null;
    priceUsd: number | null;
}

interface HeroCarouselProps {
    slides: CarouselSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const { formatUSD } = useCurrency();
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const goTo = useCallback((idx: number, dir: 'left' | 'right' = 'right') => {
        setPrevIndex(currentIndex);
        setDirection(dir);
        setCurrentIndex(idx);
    }, [currentIndex]);

    useEffect(() => {
        if (!isAutoPlaying || slides.length <= 1) return;
        const interval = setInterval(() => {
            goTo((currentIndex + 1) % slides.length, 'right');
        }, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length, currentIndex, goTo]);

    const nextSlide = () => {
        setIsAutoPlaying(false);
        goTo((currentIndex + 1) % slides.length, 'right');
    };

    const prevSlide = () => {
        setIsAutoPlaying(false);
        goTo((currentIndex - 1 + slides.length) % slides.length, 'left');
    };

    if (!slides || slides.length === 0) return null;

    const currentSlide = slides[currentIndex];
    const product = currentSlide.product;

    // Determine font size based on product name length
    const nameFontSize =
        product.name.length > 60
            ? 'text-2xl md:text-3xl'
            : product.name.length > 40
                ? 'text-3xl md:text-4xl'
                : product.name.length > 25
                    ? 'text-3xl md:text-5xl'
                    : 'text-4xl md:text-6xl';

    return (
        <div className="relative w-full overflow-hidden group" style={{ minHeight: '520px' }}>
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Blurred BG Image */}
                <div
                    key={`bg-${currentSlide.id}`}
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${currentSlide.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(24px) saturate(1.5)',
                        opacity: 0.25,
                        transform: 'scale(1.1)',
                    }}
                />
                {/* Dark overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--bg-primary))] via-[hsl(var(--bg-primary))]/90 to-[hsl(var(--bg-primary))]/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg-primary))]/80 via-transparent to-transparent" />
            </div>

            {/* Accent glow orb */}
            <div
                className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, hsl(var(--accent-primary)/0.12) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />

            {/* Content */}
            <div className="container relative z-20 h-full flex items-center px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">

                    {/* ── Left: Text Content ── */}
                    <div className="space-y-5 pl-0 lg:pl-8 order-2 lg:order-1">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--accent-primary))]/15 border border-[hsl(var(--accent-primary))]/35 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--accent-primary))]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent-primary))]">
                                {currentSlide.title || 'OFERTA DESTACADA'}
                            </span>
                        </div>

                        {/* Product Name — adaptive size, no truncation */}
                        <h2
                            className={`font-black tracking-tight text-white leading-tight drop-shadow-lg ${nameFontSize}`}
                            style={{ wordBreak: 'break-word', hyphens: 'auto' }}
                        >
                            {product.name}
                        </h2>

                        {/* Description — up to 3 lines */}
                        <p className="text-sm md:text-base text-gray-300 line-clamp-3 max-w-xl leading-relaxed">
                            {product.description}
                        </p>

                        {/* Price Block */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 inline-block backdrop-blur-sm">
                            <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                                {/* ARS Price — Primary */}
                                {currentSlide.priceArs ? (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))] mb-0.5">
                                            Precio ARS
                                        </p>
                                        <span className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]">
                                            $ {currentSlide.priceArs.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))] mb-0.5">
                                            Precio ARS
                                        </p>
                                        <span className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]">
                                            {formatUSD(Number(product.price))}
                                        </span>
                                    </div>
                                )}

                                {/* USD Price — Secondary */}
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))] mb-0.5">
                                        Ref. USD
                                    </p>
                                    <span className="text-xl md:text-2xl text-gray-400 font-semibold">
                                        {currentSlide.priceUsd
                                            ? formatUSD(currentSlide.priceUsd)
                                            : formatUSD(Number(product.price))}
                                    </span>
                                </div>
                            </div>

                            {/* Stock indicator */}
                            {product.stockTotal > 0 ? (
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs text-green-400 font-bold uppercase tracking-wide">
                                        En Stock · {product.stockTotal} unidad{product.stockTotal !== 1 ? 'es' : ''}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-xs text-red-400 font-bold uppercase tracking-wide">
                                        Sin Stock
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* CTA Button */}
                        <div className="flex gap-3 pt-1">
                            <Link
                                href={`/products/${product.id}`}
                                className="btn btn-primary px-6 py-3.5 text-base rounded-xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.3)] hover:shadow-[0_0_35px_rgba(var(--accent-primary-rgb),0.5)] transition-all font-bold"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Ver Oferta
                            </Link>
                        </div>
                    </div>

                    {/* ── Right: Product Image ── */}
                    <div className="relative flex items-center justify-center order-1 lg:order-2 h-[220px] md:h-[300px] lg:h-[420px]">
                        {/* Glow behind image */}
                        <div
                            className="absolute inset-0 rounded-3xl"
                            style={{
                                background: 'radial-gradient(ellipse at center, hsl(var(--accent-primary)/0.15) 0%, transparent 70%)',
                                filter: 'blur(20px)',
                            }}
                        />

                        <div className="relative w-full h-full max-w-[420px] mx-auto">
                            <Image
                                key={currentSlide.id}
                                src={currentSlide.imageUrl}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-2xl transition-all duration-700"
                                sizes="(max-width: 768px) 80vw, 420px"
                                priority
                            />
                        </div>

                        {/* Slide counter badge (top-right of image) */}
                        {slides.length > 1 && (
                            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
                                <Layers className="w-3 h-3 text-white/60" />
                                <span className="text-[10px] font-bold text-white/60 tabular-nums">
                                    {currentIndex + 1}/{slides.length}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        aria-label="Anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-white/15 border border-white/10 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100 z-30"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={nextSlide}
                        aria-label="Siguiente"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-white/15 border border-white/10 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100 z-30"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => { goTo(idx, idx > currentIndex ? 'right' : 'left'); setIsAutoPlaying(false); }}
                                aria-label={`Ir a oferta ${idx + 1}`}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'w-8 bg-[hsl(var(--accent-primary))]'
                                    : 'w-2 bg-white/25 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

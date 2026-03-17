'use client';

import Link from 'next/link';
import { Product } from '@prisma/client';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ShoppingCart, Gamepad2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

// Serialized product type for client components
type SerializedProduct = Omit<Product, 'price'> & { price: number };

interface ProductCardProps {
    product: SerializedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
    const { formatUSD, formatARS } = useCurrency();

    const isGamer = product.gamer;

    if (isGamer) {
        return (
            <div className="group h-full">
                {/* Animated glow border wrapper */}
                <div className="relative h-full p-[2px] rounded-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #a855f7, #0ea5e9, #7c3aed)',
                        backgroundSize: '300% 300%',
                        animation: 'gamerBorderSpin 4s linear infinite',
                    }}>

                    {/* Inner card */}
                    <div className="relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                        style={{
                            background: 'radial-gradient(ellipse at top, #0f0a1e 0%, #070711 60%, #0a0a14 100%)',
                        }}>

                        {/* Atmospheric top glow */}
                        <div className="absolute top-0 left-0 right-0 h-32 opacity-30 pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse at top, #7c3aed 0%, transparent 70%)',
                            }} />

                        {/* Scan line effect on hover */}
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden rounded-2xl">
                            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent"
                                style={{ animation: 'gamerScanLine 2s ease-in-out infinite' }} />
                        </div>

                        {/* Corners accent */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-400 rounded-tl-md opacity-80 pointer-events-none" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-md opacity-80 pointer-events-none" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-md opacity-80 pointer-events-none" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-400 rounded-br-md opacity-80 pointer-events-none" />

                        {/* Image Container */}
                        <Link href={`/products/${product.id}`} className="block">
                            <div className="relative aspect-square overflow-hidden">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-108 transition-transform duration-700"
                                        style={{ filter: 'saturate(1.15) contrast(1.05)' }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #1a0a2e, #0a1628)' }}>
                                        <ShoppingCart className="w-16 h-16 text-purple-400 opacity-30" />
                                    </div>
                                )}

                                {/* Image dark overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#070711]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* GAMER Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(6,182,212,0.9))',
                                            boxShadow: '0 0 12px rgba(124,58,237,0.6), 0 0 24px rgba(124,58,237,0.2)',
                                            border: '1px solid rgba(168,85,247,0.5)',
                                        }}>
                                        <Gamepad2 size={11} className="text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white">GAMER</span>
                                    </div>
                                </div>

                                {/* Stock Badge */}
                                <div className="absolute top-3 right-3 z-10">
                                    {product.stock > 0 ? (
                                        <div className="h-6 px-3 rounded-full bg-[#10b981] shadow-lg shadow-green-900/20 border border-green-400/20 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">En Stock</span>
                                        </div>
                                    ) : (
                                        <div className="h-6 px-3 rounded-full bg-[#ef4444] shadow-lg shadow-red-900/20 border border-red-400/20 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Agotado</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>

                        {/* Content */}
                        <div className="flex-1 flex flex-col p-6">
                            <Link href={`/products/${product.id}`}>
                                <h3 className="font-bold text-lg mb-2 transition-colors"
                                    style={{ color: '#e2d9ff' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundImage = 'linear-gradient(90deg,#a78bfa,#67e8f9)', e.currentTarget.style.webkitBackgroundClip = 'text', e.currentTarget.style.webkitTextFillColor = 'transparent')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundImage = 'none', e.currentTarget.style.webkitTextFillColor = '#e2d9ff')}>
                                    {product.name}
                                </h3>
                            </Link>

                            <p className="text-sm mb-4 line-clamp-2 flex-1" style={{ color: '#94a3b8' }}>
                                {product.description}
                            </p>

                            <div className="space-y-3 pt-4" style={{ borderTop: '1px solid rgba(124,58,237,0.3)' }}>
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black"
                                            style={{
                                                background: 'linear-gradient(90deg, #a78bfa, #67e8f9)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}>
                                            {formatARS(product.price)}
                                        </span>
                                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#7c3aed' }}>ARS</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-sm font-semibold" style={{ color: '#94a3b8' }}>
                                            {formatUSD(product.price)}
                                        </span>
                                        <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#64748b' }}>USD</span>
                                    </div>
                                </div>

                                <AddToCartButton product={product} fullWidth />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Outer drop shadow glow */}
                <style>{`
                    @keyframes gamerBorderSpin {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes gamerScanLine {
                        0% { top: -4px; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                `}</style>
            </div>
        );
    }

    // ─── Normal card ────────────────────────────────────────────────────────
    return (
        <div className="group h-full">
            <div className="relative h-full flex flex-col backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white/[0.08] to-white/[0.03] border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-[hsl(var(--accent-primary))]/10">

                {/* Image Container */}
                <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[hsl(var(--bg-tertiary))] to-[hsl(var(--bg-secondary))]">
                                <ShoppingCart className="w-16 h-16 text-[hsl(var(--text-tertiary))] opacity-30" />
                            </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Stock Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            {product.stock > 0 ? (
                                <div className="h-6 px-3 rounded-full bg-[#10b981] shadow-lg shadow-green-900/20 border border-green-400/20 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">En Stock</span>
                                </div>
                            ) : (
                                <div className="h-6 px-3 rounded-full bg-[#ef4444] shadow-lg shadow-red-900/20 border border-red-400/20 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Agotado</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>

                {/* Content */}
                <div className="flex-1 flex flex-col p-6">
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="text-sm text-[hsl(var(--text-secondary))] mb-4 line-clamp-2 flex-1">
                        {product.description}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent">
                                    {formatARS(product.price)}
                                </span>
                                <span className="text-xs text-[hsl(var(--text-tertiary))] font-medium uppercase tracking-wider">ARS</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    {formatUSD(product.price)}
                                </span>
                                <span className="text-[10px] text-[hsl(var(--text-tertiary))] font-medium uppercase tracking-widest">USD</span>
                            </div>
                        </div>

                        <AddToCartButton product={product} fullWidth />
                    </div>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
            </div>
        </div>
    );
}

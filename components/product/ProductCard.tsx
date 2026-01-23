'use client';

import Link from 'next/link';
import { Product } from '@prisma/client';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ShoppingCart, Zap, Gamepad2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

// Serialized product type for client components
type SerializedProduct = Omit<Product, 'price'> & { price: number };

interface ProductCardProps {
    product: SerializedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
    const { formatUSD, formatARS } = useCurrency();

    const isGamer = product.gamer;

    return (
        <div className="group h-full">
            <div className={`relative h-full flex flex-col backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 ${isGamer
                ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a2e] to-[#0f0f1a] border-indigo-500/50 hover:border-indigo-400 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/40 ring-1 ring-white/10'
                : 'bg-gradient-to-br from-white/[0.08] to-white/[0.03] border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-[hsl(var(--accent-primary))]/10'
                }`}>
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
                        <div className="absolute top-4 right-4">
                            {product.stock > 0 ? (
                                <div className="px-3 py-1 rounded-full bg-[#10b981] shadow-lg shadow-green-900/20 border border-green-400/20">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">En Stock</span>
                                </div>
                            ) : (
                                <div className="px-3 py-1 rounded-full bg-[#ef4444] shadow-lg shadow-red-900/20 border border-red-400/20">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Agotado</span>
                                </div>
                            )}
                        </div>
                        {/* Gamer Badge */}
                        {isGamer && (
                            <div className="absolute top-4 left-4 z-10">
                                <div className="px-3 py-1 rounded-md bg-indigo-600 shadow-lg shadow-indigo-500/50 flex items-center gap-2 border border-indigo-400/50">
                                    <Gamepad2 size={12} className="text-white fill-current animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">GAMER</span>
                                </div>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Content */}
                <div className="flex-1 flex flex-col p-6">
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors line-clamp-2 min-h-[3.5rem]">
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
                                    {formatUSD(product.price)}
                                </span>
                                <span className="text-xs text-[hsl(var(--text-tertiary))] font-medium uppercase tracking-wider">USD</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    {formatARS(product.price)}
                                </span>
                                <span className="text-[10px] text-[hsl(var(--text-tertiary))] font-medium uppercase tracking-widest">ARS</span>
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

'use client';

import Link from 'next/link';
import { Product } from '@prisma/client';
import { useCurrency } from '@/context/CurrencyContext';
import { CartQuantityControls } from '@/components/cart/CartQuantityControls';

type SerializedProduct = Omit<Product, 'price'> & { price: number };

interface Props {
    product: SerializedProduct;
}

export function ProductListCard({ product }: Props) {
    const { formatARS } = useCurrency();

    let stockStatus = { label: 'SIN STOCK', color: 'bg-red-500', text: 'text-red-500' };
    if (product.stock > 10) {
        stockStatus = { label: 'Stock alto', color: 'bg-green-500', text: 'text-green-500' };
    } else if (product.stock > 0) {
        stockStatus = { label: 'Stock bajo', color: 'bg-orange-500', text: 'text-orange-500' };
    }

    const formattedPrice = formatARS(product.price);
    const priceParts = formattedPrice.split(',');

    return (
        <div className="flex flex-col p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-lg transition-colors gap-3">
            <div className="flex items-start justify-between gap-4">
                <Link href={`/products/${product.slug || product.id}`} className="flex-1">
                    <h3 className="font-medium text-sm text-[hsl(var(--text-primary))] hover:text-[hsl(var(--accent-primary))] transition-colors uppercase">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 shrink-0 w-32">
                    <div className={`w-2 h-2 rounded-full ${stockStatus.color}`} />
                    <span className={`text-xs ${stockStatus.text}`}>{stockStatus.label}</span>
                </div>

                <div className="shrink-0 text-right font-bold text-[hsl(var(--text-primary))] w-32">
                    {priceParts[0]}
                    {priceParts[1] && <sup className="text-[10px] ml-0.5">{priceParts[1]}</sup>}
                </div>

                <div className="shrink-0 pl-4">
                    <CartQuantityControls product={product} />
                </div>
            </div>

            <div className="flex items-center gap-8 text-xs text-[hsl(var(--text-secondary))] pt-2 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="uppercase text-[10px] text-[hsl(var(--text-tertiary))]">SKU</span>
                    <span className="font-medium text-[hsl(var(--text-secondary))]">{product.sku}</span>
                </div>
                <div className="flex flex-col">
                    <span className="uppercase text-[10px] text-[hsl(var(--text-tertiary))]">Garantía</span>
                    <span className="font-medium text-[hsl(var(--text-secondary))]">{product.garantia || '12 meses'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="uppercase text-[10px] text-[hsl(var(--text-tertiary))]">Marca</span>
                    <span className="font-medium text-[hsl(var(--text-secondary))]">{product.marca || '-'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="uppercase text-[10px] text-[hsl(var(--text-tertiary))]">iva</span>
                    <span className="font-medium text-[hsl(var(--text-secondary))]">{product.iva ? `${Number(product.iva)} %` : '21 %'}</span>
                </div>
            </div>
        </div>
    );
}

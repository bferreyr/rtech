'use client';

import { useCart } from "@/context/CartContext";
import { SerializedProduct } from "@/context/CartContext";
import { Minus, Plus } from "lucide-react";

interface Props {
    product: SerializedProduct;
}

export function CartQuantityControls({ product }: Props) {
    const { items, addItem, updateQuantity, removeItem } = useCart();
    const cartItem = items.find(item => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleMinus = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else if (quantity === 1) {
            removeItem(product.id);
        }
    };

    const handlePlus = () => {
        if (quantity === 0) {
            addItem(product);
        } else {
            updateQuantity(product.id, quantity + 1);
        }
    };

    return (
        <div className="flex items-center rounded-lg border border-white/10 bg-white/5 h-8 w-24 overflow-hidden">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    handleMinus();
                }}
                disabled={quantity === 0}
                className="flex-1 h-full flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Minus size={14} className="text-[hsl(var(--text-secondary))]" />
            </button>
            
            <div className="flex-1 h-full flex items-center justify-center border-x border-white/10 bg-black/20 text-sm font-medium">
                {quantity}
            </div>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    handlePlus();
                }}
                className="flex-1 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-[hsl(var(--accent-primary))]"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}

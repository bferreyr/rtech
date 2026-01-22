"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export function CartTrigger() {
    const { toggleCart, cartCount } = useCart();

    return (
        <button
            onClick={toggleCart}
            className="relative group p-2 hover:bg-[color:var(--bg-tertiary)] rounded-full transition-colors"
        >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--accent-primary)] text-[10px] text-white animate-in zoom-in duration-200">
                    {cartCount}
                </span>
            )}
        </button>
    );
}

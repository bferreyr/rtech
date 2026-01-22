'use client';

import { useCart } from "@/context/CartContext";
import { Product } from "@prisma/client";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface Props {
    product: any;
    fullWidth?: boolean;
}

export function AddToCartButton({ product, fullWidth }: Props) {
    const { addItem } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    const handleAdd = () => {
        setIsAdding(true);
        addItem(product);

        setTimeout(() => {
            setIsAdding(false);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 2000);
        }, 400);
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                handleAdd();
            }}
            disabled={isAdding || justAdded}
            className={`btn btn-primary ${fullWidth ? 'w-full' : ''} ${isAdding ? 'scale-95' : ''} ${justAdded ? 'bg-green-600' : ''} transition-all duration-300 relative overflow-hidden group`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {justAdded ? (
                    <>
                        <Check className="w-4 h-4" />
                        ¡Añadido!
                    </>
                ) : (
                    <>
                        <ShoppingCart className="w-4 h-4" />
                        {isAdding ? 'Añadiendo...' : 'Añadir al Carrito'}
                    </>
                )}
            </span>

            {/* Ripple effect */}
            {isAdding && (
                <span className="absolute inset-0 bg-white/20 animate-ping rounded-lg" />
            )}
        </button>
    );
}

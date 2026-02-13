'use client';

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { OptimizedCheckout } from "@/components/checkout/OptimizedCheckout";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">Tu carrito está vacío</h1>
                    <p className="text-[hsl(var(--text-secondary))]">
                        Agrega productos antes de proceder al checkout
                    </p>
                    <Link href="/products" className="btn btn-primary inline-flex">
                        Ver Productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <OptimizedCheckout
            items={items}
            cartTotal={cartTotal}
            onClearCart={clearCart}
        />
    );
}

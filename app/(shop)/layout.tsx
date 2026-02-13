import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { CartProvider } from "@/context/CartContext";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CartProvider>
            <Navbar />
            <CartSidebar />
            <main className="pt-16">{children}</main>
            <Footer />
        </CartProvider>
    );
}

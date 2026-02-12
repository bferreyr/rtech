import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL('https://rtech-store.com'), // Reemplazar con dominio real en prod
    title: {
        default: "RINCÓN TECH | Hardware Premium para Profesionales",
        template: "%s | RINCÓN TECH"
    },
    description: "Tienda especializada en componentes de PC de alto rendimiento, periféricos gaming y workstations. Envíos a todo el país.",
    keywords: ["hardware", "gaming", "pc gamer", "nvidia", "componentes", "tecnología"],
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: 'https://rtech-store.com',
        siteName: 'RINCÓN TECH Store',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

import { CurrencyProvider } from "@/context/CurrencyContext";
import { Providers } from "@/components/Providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased min-h-screen bg-background text-foreground font-sans">
                <Providers>
                    <CurrencyProvider>
                        <CartProvider>
                            <Navbar />
                            <CartSidebar />
                            <main className="pt-16">{children}</main>
                            <Footer />
                        </CartProvider>
                    </CurrencyProvider>
                </Providers>
            </body>
        </html>
    );
}

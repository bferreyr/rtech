import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Metadata } from "next";
import { getExchangeRate, getGlobalMarkup } from "@/app/actions/settings";
import { ShieldCheck } from "lucide-react";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

// Helper to fetch product
async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) return null;

    const p = product as any;
    return {
        ...product,
        price: p.pvpUsd ? Number(p.pvpUsd) : Number(p.price),
        precio: Number(p.precio),
        impuestoInterno: p.impuestoInterno ? Number(p.impuestoInterno) : null,
        iva: p.iva ? Number(p.iva) : null,
        markup: p.markup ? Number(p.markup) : null,
        cotizacion: p.cotizacion ? Number(p.cotizacion) : null,
        pvpUsd: p.pvpUsd ? Number(p.pvpUsd) : null,
        pvpArs: p.pvpArs ? Number(p.pvpArs) : null,
        peso: p.peso ? Number(p.peso) : null,
        weight: p.weight ? Number(p.weight) : null,
    };
}

// SEO: Generate dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) return { title: "Producto no encontrado" };

    return {
        title: product.name,
        description: product.description.substring(0, 160),
        openGraph: {
            images: product.imageUrl ? [product.imageUrl] : [],
        },
    }
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const [productData, { rate }, globalMarkup] = await Promise.all([
        getProduct(id),
        getExchangeRate(),
        getGlobalMarkup()
    ]);

    if (!productData) {
        notFound();
    }

    // Runtime Calculation
    const baseCost = productData.precio || productData.price;
    const markupMultiplier = 1 + (globalMarkup / 100);
    const finalPvpUsd = baseCost * markupMultiplier;
    const finalPvpArs = finalPvpUsd * rate;

    // Override product object with calculated values for rendering
    const product = {
        ...productData,
        price: finalPvpUsd,
        pvpArs: finalPvpArs
    };

    const priceARS = finalPvpArs;

    // SEO: Structure Data (Schema.org)
    // Esto es lo que leen los agentes de IA para entender el producto
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.imageUrl,
        description: product.description,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: Number(product.price),
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        }
    }

    return (
        <div className="container py-12">
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header className="mb-8">
                <nav className="text-sm text-[color:var(--text-secondary)] mb-4" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2">
                        <li><Link href="/" className="hover:text-[color:var(--text-primary)]">Inicio</Link></li>
                        <li>/</li>
                        <li><Link href="/products" className="hover:text-[color:var(--text-primary)]">Productos</Link></li>
                        <li>/</li>
                        <li className="text-[color:var(--text-primary)] font-medium" aria-current="page">{product.name}</li>
                    </ol>
                </nav>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Section */}
                <section aria-label="Galería de imágenes" className="aspect-square bg-[color:var(--bg-secondary)] rounded-xl overflow-hidden border border-[color:var(--border-color)]">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={`Vista detallada de ${product.name}`}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[color:var(--text-tertiary)]">
                            No hay imagen disponible
                        </div>
                    )}
                </section>

                {/* Info Section */}
                <section className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 tracking-tight">{product.name}</h1>
                        <div className="flex flex-col">
                            <p className="text-4xl font-black bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent">
                                ${Number(product.price).toFixed(2)}
                                <span className="text-sm font-normal text-[color:var(--text-tertiary)] ml-2 uppercase tracking-widest">USD</span>
                            </p>
                            <p className="text-xl font-bold text-[color:var(--text-secondary)] mt-1">
                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(priceARS)}
                                <span className="text-xs font-medium text-[color:var(--text-tertiary)] ml-2 uppercase tracking-widest">ARS (Hoy)</span>
                            </p>
                        </div>
                    </div>

                    {/* Product Specifications */}
                    <div className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] p-5">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[color:var(--text-secondary)]">Especificaciones del Producto</h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <span className="block text-xs text-[color:var(--text-tertiary)] uppercase tracking-wider mb-1">Marca</span>
                                <span className="font-medium text-[color:var(--text-primary)]">{(product as any).marca || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[color:var(--text-tertiary)] uppercase tracking-wider mb-1">Modelo / SKU</span>
                                <span className="font-mono text-[color:var(--text-primary)]">{product.sku}</span>
                            </div>

                            <div>
                                <span className="block text-xs text-[color:var(--text-tertiary)] uppercase tracking-wider mb-1">Código Producto</span>
                                <span className="font-mono text-[color:var(--text-primary)]">{(product as any).codigoProducto || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[color:var(--text-tertiary)] uppercase tracking-wider mb-1">Código Alfa</span>
                                <span className="font-mono text-[color:var(--text-primary)]">{(product as any).codigoAlfa || 'N/A'}</span>
                            </div>

                            <div>
                                <span className="block text-xs text-[color:var(--text-tertiary)] uppercase tracking-wider mb-1">EAN</span>
                                <span className="font-mono text-[color:var(--text-primary)]">{(product as any).ean || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[color:var(--text-tertiary)] uppercase tracking-wider mb-1">ID Sistema</span>
                                <span className="font-mono text-[color:var(--text-primary)] text-xs truncate" title={product.id}>{product.id}</span>
                            </div>

                            {(product as any).garantia && (
                                <div className="col-span-2 border-t border-[color:var(--border-color)] pt-4 mt-2">
                                    <span className="block text-xs text-[color:var(--text-tertiary)] uppercase tracking-wider mb-2">Garantía Asegurada</span>
                                    <div className="flex items-center gap-2 text-green-400 bg-green-500/10 w-fit px-3 py-1.5 rounded-lg border border-green-500/20">
                                        <ShieldCheck size={16} />
                                        <span className="font-semibold">{(product as any).garantia}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-[color:var(--text-secondary)] leading-relaxed text-lg">
                        {product.description}
                    </p>

                    <div className="space-y-6 pt-6 border-t border-[color:var(--border-color)]">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[color:var(--text-secondary)]">Disponibilidad</span>
                            <span className={`font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {product.stock > 0 ? `En Stock (${product.stock})` : 'Agotado'}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <AddToCartButton product={product} fullWidth />
                            <button className="btn btn-outline w-full py-4 text-center">
                                Comprar Ahora
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

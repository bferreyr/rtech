import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WhatsAppProductButton } from "@/components/product/WhatsAppProductButton";
import { Metadata } from "next";
import { getExchangeRate, getGlobalMarkup } from "@/app/actions/settings";
import { ShieldCheck, Info } from "lucide-react";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductDescription } from "@/components/product/ProductDescription";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

// Helper to fetch product
async function getProduct(identifier: string) {
    const product = await prisma.product.findFirst({
        where: {
            OR: [
                { slug: identifier },
                { id: identifier }
            ]
        },
        include: { images: { orderBy: { order: 'asc' } } },
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
    const { slug } = await params;
    const product = await getProduct(slug);

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
    const { slug } = await params;
    const [productData, { rate }, globalMarkup] = await Promise.all([
        getProduct(slug),
        getExchangeRate(),
        getGlobalMarkup()
    ]);

    if (!productData) {
        notFound();
    }

    // Runtime Calculation
    const baseCost = productData.pvpUsd ? Number(productData.pvpUsd) : (productData.precio || productData.price);
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
                {/* Image Gallery Section */}
                <ProductImageGallery
                    mainImageUrl={product.imageUrl ?? null}
                    images={(product as any).images ?? []}
                    productName={product.name}
                />

                {/* Info Section */}
                <section className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 tracking-tight">{product.name}</h1>
                        <div className="space-y-6 mt-8">
                            {/* Price Group */}
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-[color:var(--text-tertiary)] uppercase tracking-[0.2em] mb-3">Precio Final</p>
                                <div className="flex flex-col">
                                    <p className="text-5xl font-black bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent leading-none py-1">
                                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(priceARS)}
                                    </p>
                                    <p className="text-xl font-bold text-[color:var(--text-secondary)] mt-1 flex items-center gap-2">
                                        <span>${Number(product.price).toFixed(2)}</span>
                                        <span className="text-xs font-medium text-[color:var(--text-tertiary)] uppercase tracking-widest bg-[color:var(--bg-secondary)] px-2 py-0.5 rounded">USD (Ref.)</span>
                                    </p>
                                </div>
                            </div>

                            {/* Actions Group - Horizontal Alignment */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <AddToCartButton product={product} />
                                <WhatsAppProductButton
                                    productName={product.name}
                                    sku={product.sku}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Specifications */}
                    <div className="rounded-2xl border border-white/10 bg-[#09090b]/80 backdrop-blur-md p-6 shadow-xl">
                        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-[color:var(--text-secondary)] flex items-center gap-2">
                            <Info size={16} className="text-[hsl(var(--accent-primary))]" />
                            Especificaciones Principales
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors group">
                                <span className="block text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-widest mb-1 group-hover:text-white/70 transition-colors">Marca</span>
                                <span className="font-semibold text-[color:var(--text-primary)] text-sm">{(product as any).marca || 'N/A'}</span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors group">
                                <span className="block text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-widest mb-1 group-hover:text-white/70 transition-colors">Modelo / SKU</span>
                                <span className="font-mono text-[color:var(--text-primary)] text-sm truncate block" title={product.sku}>{product.sku}</span>
                            </div>
                            {(product as any).codigoAlfa && (
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors group">
                                    <span className="block text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-widest mb-1 group-hover:text-white/70 transition-colors">Cód. Alfa</span>
                                    <span className="font-mono text-[color:var(--text-primary)] text-sm">{(product as any).codigoAlfa}</span>
                                </div>
                            )}
                            {(product as any).ean && (
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors group">
                                    <span className="block text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-widest mb-1 group-hover:text-white/70 transition-colors">EAN</span>
                                    <span className="font-mono text-[color:var(--text-primary)] text-sm truncate block" title={(product as any).ean}>{(product as any).ean}</span>
                                </div>
                            )}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors group">
                                <span className="block text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-widest mb-1 group-hover:text-white/70 transition-colors">ID Sistema</span>
                                <span className="font-mono text-[color:var(--text-primary)] text-[10px] truncate block opacity-70" title={product.id}>{product.id}</span>
                            </div>
                        </div>

                        <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-end gap-3">
                            {(product as any).garantia && (
                                <div className="flex-1 min-w-[180px]">
                                    <span className="block text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-widest mb-1.5">Garantía Asegurada</span>
                                    <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20 w-full transition-all hover:bg-emerald-500/20">
                                        <ShieldCheck size={16} />
                                        <span className="font-bold text-xs">{(product as any).garantia}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 min-w-[180px]">
                                <span className="block text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-widest mb-1.5">Disponibilidad</span>
                                <div className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all w-full ${product.stock > 0
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${product.stock > 0 ? 'bg-blue-400' : 'bg-rose-400'}`} />
                                    {product.stock > 0 ? `STOCK: ${product.stock} UNI.` : 'SIN STOCK'}
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </main>

            {/* Description Section - Moved below main product info for better visibility of long texts */}
            <section className="mt-16 border-t border-[color:var(--border-color)] pt-12">
                <h2 className="text-2xl font-bold mb-6">Especificaciones Detalladas</h2>
                <ProductDescription description={product.description} />
            </section>

            {/* Reviews Section */}
            <section className="mt-16">
                <ReviewsSection productId={product.id} />
            </section>
        </div>
    );
}

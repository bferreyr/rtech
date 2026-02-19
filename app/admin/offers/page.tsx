import { getCarouselSlides, deleteCarouselSlide, toggleCarouselSlide } from "@/app/actions/carousel";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Edit, Move } from "lucide-react";

export default async function OffersPage() {
    const slides = await getCarouselSlides();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Ofertas</h1>
                    <p className="text-[hsl(var(--text-secondary))]">Administra el carrusel de ofertas de la página principal.</p>
                </div>
                <Link
                    href="/admin/offers/new"
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Oferta
                </Link>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Orden</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Imagen</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Producto</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Título</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Precios (ARS/USD)</th>
                                <th className="text-left p-4 font-medium text-[hsl(var(--text-secondary))]">Estado</th>
                                <th className="text-right p-4 font-medium text-[hsl(var(--text-secondary))]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {slides.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[hsl(var(--text-secondary))]">
                                        No hay ofertas activas. Crea una para empezar.
                                    </td>
                                </tr>
                            ) : (
                                slides.map((slide) => (
                                    <tr key={slide.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-[hsl(var(--text-tertiary))]">
                                                <Move className="w-4 h-4 cursor-grab active:cursor-grabbing" />
                                                {slide.order}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10">
                                                <Image
                                                    src={slide.imageUrl}
                                                    alt={slide.title || "Offer image"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">{slide.product.name}</span>
                                                <span className="text-sm text-[hsl(var(--text-tertiary))]">{slide.product.sku}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm">{slide.title || "-"}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col text-sm">
                                                {slide.priceArs && (
                                                    <span className="text-[hsl(var(--accent-primary))] font-medium">
                                                        ARS ${slide.priceArs.toLocaleString()}
                                                    </span>
                                                )}
                                                {slide.priceUsd && (
                                                    <span className="text-green-400">
                                                        USD ${slide.priceUsd.toLocaleString()}
                                                    </span>
                                                )}
                                                {!slide.priceArs && !slide.priceUsd && (
                                                    <span className="text-[hsl(var(--text-tertiary))]">Original</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <form action={async () => {
                                                'use server';
                                                await toggleCarouselSlide(slide.id, !slide.active);
                                            }}>
                                                <button
                                                    type="submit"
                                                    className={`p-2 rounded-lg transition-colors ${slide.active
                                                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                        }`}
                                                >
                                                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </form>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/offers/${slide.id}`}
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <form action={async () => {
                                                    'use server';
                                                    await deleteCarouselSlide(slide.id);
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

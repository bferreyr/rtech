'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Search, Check } from 'lucide-react';
import { createCarouselSlide, updateCarouselSlide } from '@/app/actions/carousel';
import { searchProducts } from '@/app/actions/products';

interface OfferFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export function OfferForm({ initialData, isEditing = false }: OfferFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(initialData?.product || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [previewImage, setPreviewImage] = useState<string>(initialData?.imageUrl || '');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // We reuse the existing product search action
            const results = await searchProducts(query);
            setSearchResults(results);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleProductSelect = (product: any) => {
        setSelectedProduct(product);
        setSearchQuery('');
        setSearchResults([]);
        // Auto-fill title if empty
        const titleInput = document.getElementById('title') as HTMLInputElement;
        if (titleInput && !titleInput.value) {
            titleInput.value = product.name;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        if (!selectedProduct) {
            alert('Por favor selecciona un producto');
            setLoading(false);
            return;
        }

        formData.set('productId', selectedProduct.id);

        try {
            if (isEditing && initialData?.id) {
                await updateCarouselSlide(initialData.id, formData);
            } else {
                await createCarouselSlide(formData);
            }
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la oferta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 space-y-6">
                <h2 className="text-xl font-bold border-b border-white/10 pb-4">
                    {isEditing ? 'Editar Oferta' : 'Nueva Oferta'}
                </h2>

                {/* Product Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-[hsl(var(--text-secondary))]">
                        Producto Asociado *
                    </label>

                    {selectedProduct ? (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
                                <Image
                                    src={selectedProduct.imageUrl || '/placeholder.png'}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">{selectedProduct.name}</h4>
                                <p className="text-sm text-[hsl(var(--text-tertiary))]">{selectedProduct.sku}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-tertiary))]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Buscar producto por nombre, SKU o marca..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 ring-[hsl(var(--accent-primary))] transition-all outline-none"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                                    {searchResults.map((product) => (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => handleProductSelect(product)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                                        >
                                            <div className="relative w-10 h-10 rounded bg-white shrink-0">
                                                <Image
                                                    src={product.imageUrl || '/placeholder.png'}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-0.5"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium line-clamp-1">{product.name}</div>
                                                <div className="text-xs text-[hsl(var(--text-tertiary))]">{product.sku}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Image URL */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-[hsl(var(--text-secondary))]">
                        URL de la Imagen (Banner) *
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="url"
                            name="imageUrl"
                            required
                            defaultValue={initialData?.imageUrl}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-[hsl(var(--accent-primary))] transition-all outline-none"
                        />
                    </div>
                    {previewImage && (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                            <Image
                                src={previewImage}
                                alt="Preview"
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <p className="text-xs text-[hsl(var(--text-tertiary))]">
                        Recomendado: Imágenes transparentes (PNG/WebP) o con fondo oscuro.
                    </p>
                </div>

                {/* Offer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-[hsl(var(--text-secondary))]">
                            Título (Opcional)
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            defaultValue={initialData?.title}
                            placeholder="Ej: OFERTA FLASH"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-[hsl(var(--accent-primary))] transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[hsl(var(--text-secondary))]">
                            Estado
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-black/20 border border-white/10 rounded-xl">
                            <input
                                type="checkbox"
                                name="active"
                                value="true"
                                defaultChecked={initialData?.active ?? true}
                                className="w-5 h-5 rounded border-white/10 bg-white/5 text-[hsl(var(--accent-primary))] focus:ring-[hsl(var(--accent-primary))]"
                            />
                            <span className="text-sm">Activo en el carrusel</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[hsl(var(--text-secondary))]">
                            Precio Oferta ARS (Opcional)
                        </label>
                        <input
                            type="number"
                            name="priceArs"
                            step="0.01"
                            defaultValue={initialData?.priceArs}
                            placeholder="Dejar vacio para usar precio original"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-[hsl(var(--accent-primary))] transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[hsl(var(--text-secondary))]">
                            Precio Oferta USD (Opcional)
                        </label>
                        <input
                            type="number"
                            name="priceUsd"
                            step="0.01"
                            defaultValue={initialData?.priceUsd}
                            placeholder="Dejar vacio para usar precio original"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 ring-[hsl(var(--accent-primary))] transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn btn-secondary"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-primary min-w-[150px]"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Guardando...
                        </div>
                    ) : (
                        isEditing ? 'Actualizar Oferta' : 'Crear Oferta'
                    )}
                </button>
            </div>
        </form>
    );
}

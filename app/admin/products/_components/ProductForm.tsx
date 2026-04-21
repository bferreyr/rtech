'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Plus, Trash2, ImageIcon } from 'lucide-react';

function SubmitButton({ isEdit }: { isEdit?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="btn btn-primary w-full md:w-auto"
        >
            {pending ? 'Guardando...' : (isEdit ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
    );
}

interface AdditionalImage {
    url: string;
}

interface ProductFormProps {
    action: (formData: FormData) => void;
    categories: { id: string, name: string }[];
    initialData?: {
        sku: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        imageUrl: string | null;
        categoryId: string | null;
        additionalImages?: AdditionalImage[];
    };
}

export function ProductForm({ action, categories, initialData }: ProductFormProps) {
    const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>(
        initialData?.additionalImages ?? []
    );

    const addImage = () => {
        setAdditionalImages(prev => [...prev, { url: '' }]);
    };

    const removeImage = (index: number) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    const updateImage = (index: number, url: string) => {
        setAdditionalImages(prev =>
            prev.map((img, i) => (i === index ? { url } : img))
        );
    };

    return (
        <form action={action} className="space-y-6 max-w-2xl bg-[color:var(--bg-secondary)] p-8 rounded-xl border border-[color:var(--border-color)]">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="sku" className="text-sm font-medium">SKU / Código</label>
                    <input
                        type="text"
                        name="sku"
                        id="sku"
                        required
                        placeholder="e.g. RTX-4090-ROG"
                        defaultValue={initialData?.sku}
                        className="w-full p-2 rounded-md bg-[color:var(--bg-primary)] border border-[color:var(--border-color)]"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="categoryId" className="text-sm font-medium">Categoría</label>
                    <select
                        name="categoryId"
                        id="categoryId"
                        defaultValue={initialData?.categoryId || ''}
                        className="w-full p-2 rounded-md bg-[color:var(--bg-primary)] border border-[color:var(--border-color)] text-[color:var(--text-primary)] [color-scheme:dark]"
                    >
                        <option value="" className="bg-[color:var(--bg-primary)] text-[color:var(--text-primary)]">Sin Categoría</option>
                        {categories?.map((cat) => (
                            <option
                                key={cat.id}
                                value={cat.id}
                                className="bg-[color:var(--bg-primary)] text-[color:var(--text-primary)]"
                            >
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nombre del Producto</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        defaultValue={initialData?.name}
                        className="w-full p-2 rounded-md bg-[color:var(--bg-primary)] border border-[color:var(--border-color)]"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Precio (USD)</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        required
                        defaultValue={initialData?.price}
                        className="w-full p-2 rounded-md bg-[color:var(--bg-primary)] border border-[color:var(--border-color)]"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Descripción</label>
                <textarea
                    name="description"
                    id="description"
                    required
                    rows={4}
                    defaultValue={initialData?.description}
                    className="w-full p-2 rounded-md bg-[color:var(--bg-primary)] border border-[color:var(--border-color)]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-medium">Stock Inicial</label>
                    <input
                        type="number"
                        name="stock"
                        id="stock"
                        required
                        defaultValue={initialData?.stock}
                        className="w-full p-2 rounded-md bg-[color:var(--bg-primary)] border border-[color:var(--border-color)]"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="imageUrl" className="text-sm font-medium">
                        URL de Imagen Principal
                    </label>
                    <input
                        type="url"
                        name="imageUrl"
                        id="imageUrl"
                        placeholder="https://ejemplo.com/foto.jpg"
                        defaultValue={initialData?.imageUrl || ''}
                        className="w-full p-2 rounded-md bg-[color:var(--bg-primary)] border border-[color:var(--border-color)]"
                    />
                </div>
            </div>

            {/* ── Additional Images Section ─────────────────────────────── */}
            <div className="space-y-4 pt-4 border-t border-[color:var(--border-color)]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Imágenes Adicionales</p>
                        <p className="text-xs text-[color:var(--text-tertiary)] mt-0.5">
                            Se muestran como galería en la página del producto
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addImage}
                        className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-[color:var(--accent-primary)]/10 text-[color:var(--accent-primary)] border border-[color:var(--accent-primary)]/20 hover:bg-[color:var(--accent-primary)]/20 transition-colors"
                    >
                        <Plus size={14} />
                        Agregar imagen
                    </button>
                </div>

                {additionalImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 rounded-lg border border-dashed border-[color:var(--border-color)] text-[color:var(--text-tertiary)]">
                        <ImageIcon size={24} />
                        <p className="text-sm">No hay imágenes adicionales</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {additionalImages.map((img, index) => (
                            <div key={index} className="flex gap-3 items-start">
                                {/* Preview thumbnail */}
                                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-[color:var(--bg-primary)] border border-[color:var(--border-color)] flex items-center justify-center">
                                    {img.url ? (
                                        <img
                                            src={img.url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <ImageIcon size={16} className="text-[color:var(--text-tertiary)]" />
                                    )}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <label className="text-xs text-[color:var(--text-tertiary)]">
                                        Imagen {index + 1}
                                    </label>
                                    {/* Hidden input so it is submitted with the form */}
                                    <input
                                        type="hidden"
                                        name="additionalImages[]"
                                        value={img.url}
                                    />
                                    <input
                                        type="url"
                                        placeholder="https://ejemplo.com/foto-2.jpg"
                                        value={img.url}
                                        onChange={(e) => updateImage(index, e.target.value)}
                                        className="w-full p-2 rounded-md bg-[color:var(--bg-primary)] border border-[color:var(--border-color)] text-sm"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="mt-5 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                                    title="Eliminar imagen"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-[color:var(--border-color)] flex justify-end">
                <SubmitButton isEdit={!!initialData} />
            </div>
        </form>
    );
}

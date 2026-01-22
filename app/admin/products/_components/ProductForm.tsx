'use client';

import { useFormStatus } from 'react-dom';

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
    };
}

export function ProductForm({ action, categories, initialData }: ProductFormProps) {
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
                    <label htmlFor="imageUrl" className="text-sm font-medium">URL de Imagen</label>
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

            <div className="pt-4 border-t border-[color:var(--border-color)] flex justify-end">
                <SubmitButton isEdit={!!initialData} />
            </div>
        </form>
    );
}

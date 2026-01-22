import { prisma } from "@/lib/prisma";
import { updateCategory } from "@/app/actions/categories";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const category = await prisma.category.findUnique({
        where: { id: params.id }
    });

    if (!category) notFound();

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editar Categoría</h1>
                    <p className="text-[color:var(--text-secondary)]">Modifica los detalles de la categoría.</p>
                </div>
            </div>

            <form action={updateCategory.bind(null, category.id)} className="glass-card p-8 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nombre de la Categoría</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={category.name}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[color:var(--accent-primary)] transition-colors"
                        placeholder="Ej: Procesadores"
                    />
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-[color:var(--text-tertiary)] uppercase font-bold tracking-widest">Slug Actual:</span>
                        <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-[color:var(--accent-primary)]">{category.slug}</code>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Link href="/admin/categories" className="btn btn-outline h-12 px-8">
                        Cancelar
                    </Link>
                    <button type="submit" className="btn btn-primary h-12 px-8">
                        <Save size={20} className="mr-2" /> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}

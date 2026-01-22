import { createCategory } from "@/app/actions/categories";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewCategoryPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nueva Categoría</h1>
                    <p className="text-[color:var(--text-secondary)]">Crea una nueva categoría para organizar tus productos.</p>
                </div>
            </div>

            <form action={createCategory} className="glass-card p-8 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nombre de la Categoría</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[color:var(--accent-primary)] transition-colors"
                        placeholder="Ej: Procesadores"
                    />
                    <p className="text-xs text-[color:var(--text-tertiary)]">
                        El slug se generará automáticamente a partir del nombre.
                    </p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Link href="/admin/categories" className="btn btn-outline h-12 px-8">
                        Cancelar
                    </Link>
                    <button type="submit" className="btn btn-primary h-12 px-8">
                        <Save size={20} className="mr-2" /> Guardar Categoría
                    </button>
                </div>
            </form>
        </div>
    );
}

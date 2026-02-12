import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, Tag, FileDown } from "lucide-react";
import { deleteCategory } from "@/app/actions/categories";
import { BulkUploadCategoriesButton } from "./_components/BulkUploadCategoriesButton";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
    // @ts-ignore
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { products: true }
            },
            // @ts-ignore
            parent: true
        }
    });

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Categorías"
                description="Gestiona las categorías de tus productos."
                actions={
                    <>
                        <BulkUploadCategoriesButton />
                        <Link href="/admin/categories/new" className="btn btn-primary">
                            <Plus size={20} className="mr-2" /> Nueva Categoría
                        </Link>
                    </>
                }
            />

            <div className="flex items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl text-sm">
                <FileDown size={18} className="text-[color:var(--accent-primary)]" />
                <span className="text-[color:var(--text-secondary)]">Formato sugerido (Excel): </span>
                <code className="bg-black/20 px-2 py-0.5 rounded text-[color:var(--accent-primary)]">categoria</code>
                <span className="text-[color:var(--text-secondary)]">, </span>
                <code className="bg-black/20 px-2 py-0.5 rounded text-[color:var(--accent-primary)]">sub_categoria</code>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
                            <tr>
                                <th className="h-12 px-4 font-medium align-middle">Nombre</th>
                                <th className="h-12 px-4 font-medium align-middle">Parent</th>
                                <th className="h-12 px-4 font-medium align-middle">Slug</th>
                                <th className="h-12 px-4 font-medium align-middle text-center">Productos</th>
                                <th className="h-12 px-4 font-medium align-middle text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category: any) => (
                                <tr key={category.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg text-[color:var(--accent-primary)]">
                                            <Tag size={16} />
                                        </div>
                                        {category.name}
                                    </td>
                                    <td className="p-4 text-[color:var(--text-secondary)]">
                                        {category.parent ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
                                                {category.parent.name}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="p-4 font-mono text-xs opacity-60">
                                        {category.slug}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs font-semibold">
                                            {category._count.products}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/categories/${category.id}/edit`} className="p-2 hover:text-[color:var(--accent-primary)] transition-colors">
                                                <Pencil size={18} />
                                            </Link>
                                            <form action={deleteCategory.bind(null, category.id)}>
                                                <button
                                                    className="p-2 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

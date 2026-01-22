import { prisma } from "@/lib/prisma";
import NextLink from "next/link";
import { Plus, Pencil, Trash2, Link as LinkIcon, ShieldCheck, AlertCircle } from "lucide-react";
import { deleteProduct, getAdminProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { BulkUploadButton } from "./_components/BulkUploadButton";
import { ExportProductsButton } from "./_components/ExportProductsButton";
import { AdminFilters } from "./_components/AdminFilters";
import { Pagination } from "@/components/ui/Pagination";
import { ProductTable } from "./_components/ProductTable";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const search = searchParams.search as string;
    const categoryId = searchParams.category as string;

    const [data, categories] = await Promise.all([
        getAdminProducts({ page, limit, search, categoryId }),
        getCategories()
    ]);

    const { products, pagination } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Inventario Detallado</h1>
                    <p className="text-[color:var(--text-secondary)]">Gestiona tus productos ({pagination.total} total).</p>
                </div>
                <div className="flex items-center gap-4">
                    <ExportProductsButton products={products} />
                    <BulkUploadButton />
                    <NextLink href="/admin/products/new" className="btn btn-primary">
                        <Plus size={20} className="mr-2" /> Nuevo
                    </NextLink>
                </div>
            </div>

            <AdminFilters categories={categories} />

            <ProductTable products={products} />

            <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
        </div>
    );
}

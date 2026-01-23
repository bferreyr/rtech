import { prisma } from "@/lib/prisma";
import NextLink from "next/link";
import { Plus } from "lucide-react";
import { getAdminProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { getGlobalMarkup, getExchangeRate } from "@/app/actions/settings";
import { BulkUploadButton } from "../../products/_components/BulkUploadButton"; // Reuse
import { ExportProductsButton } from "../../products/_components/ExportProductsButton"; // Reuse
import { AdminFilters } from "../../products/_components/AdminFilters"; // Reuse
import { Pagination } from "@/components/ui/Pagination";
import { ProductTable } from "../../products/_components/ProductTable"; // Reuse

export const dynamic = 'force-dynamic';

export default async function AdminMobeProductsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const search = searchParams.search as string;
    const categoryId = searchParams.category as string;
    const PROVIDER = 'MOBE';

    const [data, categories, globalMarkup, rateData] = await Promise.all([
        getAdminProducts({ page, limit, search, categoryId, provider: PROVIDER }),
        getCategories(),
        getGlobalMarkup(),
        getExchangeRate()
    ]);
    const exchangeRate = rateData.rate;

    const { products, pagination } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Inventario MOBE</h1>
                    <p className="text-[color:var(--text-secondary)]">Gestiona productos de MOBE ({pagination.total} total).</p>
                </div>
                <div className="flex items-center gap-4">
                    <ExportProductsButton products={products} />
                    <BulkUploadButton provider={PROVIDER} />
                    <NextLink href="/admin/products/new" className="btn btn-primary">
                        <Plus size={20} className="mr-2" /> Nuevo
                    </NextLink>
                </div>
            </div>

            <AdminFilters categories={categories} />

            <ProductTable products={products} globalMarkup={globalMarkup} exchangeRate={exchangeRate} />

            <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
        </div>
    );
}

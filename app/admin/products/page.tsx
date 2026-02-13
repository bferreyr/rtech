import { prisma } from "@/lib/prisma";
import NextLink from "next/link";
import { Plus, Pencil, Trash2, Link as LinkIcon, ShieldCheck, AlertCircle } from "lucide-react";
import { deleteProduct, getAdminProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { getGlobalMarkup, getExchangeRate } from "@/app/actions/settings";
import { BulkUploadButton } from "./_components/BulkUploadButton";
import { ExportProductsButton } from "./_components/ExportProductsButton";
import { AdminFilters } from "./_components/AdminFilters";
import { Pagination } from "@/components/ui/Pagination";
import { ProductTable } from "./_components/ProductTable";
import { AdminHeader } from "@/components/admin/ui/AdminHeader";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const search = searchParams.search as string;
    const categoryId = searchParams.category as string;

    const PROVIDER = 'ELIT';

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
            <AdminHeader
                title="Inventario ELIT"
                description={`Gestiona tus productos de ELIT (${pagination.total} total).`}
                actions={
                    <>
                        <ExportProductsButton products={products} />
                        <BulkUploadButton provider={PROVIDER} />
                        <NextLink href="/admin/products/new" className="btn btn-primary">
                            <Plus size={20} className="mr-2" /> Nuevo
                        </NextLink>
                    </>
                }
            />

            <AdminFilters categories={categories} />

            <ProductTable products={products} globalMarkup={globalMarkup} exchangeRate={exchangeRate} provider={PROVIDER} />

            <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
        </div>
    );
}

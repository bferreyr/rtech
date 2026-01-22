import { prisma } from "@/lib/prisma";
import NextLink from "next/link";
import { Plus, Pencil, Trash2, Link as LinkIcon, ShieldCheck, AlertCircle } from "lucide-react";
import { deleteProduct, getAdminProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { BulkUploadButton } from "./_components/BulkUploadButton";
import { ExportProductsButton } from "./_components/ExportProductsButton";
import { AdminFilters } from "./_components/AdminFilters";
import { Pagination } from "@/components/ui/Pagination";

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

            <div className="rounded-lg border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] overflow-hidden flex flex-col">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[color:var(--bg-tertiary)] border-b border-[color:var(--border-color)]">
                            <tr>
                                <th className="h-12 px-4 font-medium align-middle sticky left-0 bg-[color:var(--bg-tertiary)] z-10 border-r border-white/5">SKU / Códigos</th>
                                <th className="h-12 px-4 font-medium align-middle">Imagen</th>
                                <th className="h-12 px-4 font-medium align-middle sticky left-[120px] bg-[color:var(--bg-tertiary)] z-10 border-r border-white/5">Nombre</th>
                                <th className="h-12 px-4 font-medium align-middle">Marca / Cat</th>
                                <th className="h-12 px-4 font-medium align-middle text-center bg-blue-500/5">Precio Base</th>
                                <th className="h-12 px-4 font-medium align-middle text-center bg-blue-500/5">Impuestos</th>
                                <th className="h-12 px-4 font-medium align-middle text-center bg-green-500/5">Markup</th>
                                <th className="h-12 px-4 font-medium align-middle text-center bg-green-500/5">PVP USD</th>
                                <th className="h-12 px-4 font-medium align-middle text-center bg-green-500/5">PVP ARS</th>
                                <th className="h-12 px-4 font-medium align-middle text-center">Stock Total</th>
                                <th className="h-12 px-4 font-medium align-middle text-center">Dep. Cliente</th>
                                <th className="h-12 px-4 font-medium align-middle text-center">Dep. CD</th>
                                <th className="h-12 px-4 font-medium align-middle">Garantía</th>
                                <th className="h-12 px-4 font-medium align-middle">Datos Físicos</th>
                                <th className="h-12 px-4 font-medium align-middle sticky right-0 bg-[color:var(--bg-tertiary)] z-10 border-l border-white/5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-[color:var(--border-color)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors">
                                    <td className="p-4 sticky left-0 bg-[color:var(--bg-secondary)] z-10 border-r border-white/5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-mono text-xs font-bold text-white">{product.sku}</span>
                                            {product.codigoAlfa && <span className="text-[10px] text-[color:var(--text-tertiary)]">Alfa: {product.codigoAlfa}</span>}
                                            {product.ean && <span className="text-[10px] text-[color:var(--text-tertiary)]">EAN: {product.ean}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-10 h-10 bg-white/5 rounded overflow-hidden">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10">
                                                    <AlertCircle size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium max-w-[200px] truncate sticky left-[120px] bg-[color:var(--bg-secondary)] z-10 border-r border-white/5" title={product.name}>
                                        {product.name}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">{product.marca || '---'}</span>
                                            <span className="text-[10px] uppercase tracking-wider opacity-60">{(product as any).category?.name}</span>
                                        </div>
                                    </td>

                                    {/* Costos Base */}
                                    <td className="p-4 text-center bg-blue-500/5">
                                        <div className="flex flex-col">
                                            <span className="font-mono">{product.precio ? `$${product.precio.toFixed(2)}` : '-'}</span>
                                            <span className="text-[10px] opacity-50">{product.moneda}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center bg-blue-500/5">
                                        <div className="flex flex-col text-[10px]">
                                            <span>IVA: {product.iva}%</span>
                                            {product.impuestoInterno && <span>Int: {product.impuestoInterno}%</span>}
                                        </div>
                                    </td>

                                    {/* Precios Venta */}
                                    <td className="p-4 text-center bg-green-500/5 font-mono text-xs">
                                        {product.markup ? `${product.markup}%` : '-'}
                                    </td>
                                    <td className="p-4 text-center bg-green-500/5">
                                        <span className="font-bold text-green-400">
                                            {product.pvpUsd ? `$${product.pvpUsd.toFixed(2)}` : (product.price ? `$${product.price.toFixed(2)}` : '-')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center bg-green-500/5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[color:var(--text-secondary)]">
                                                {product.pvpArs ? `$${new Intl.NumberFormat('es-AR').format(product.pvpArs)}` : '-'}
                                            </span>
                                            {product.cotizacion && <span className="text-[10px] opacity-50">TC: {product.cotizacion}</span>}
                                        </div>
                                    </td>

                                    {/* Stocks */}
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${product.stockTotal > 0 ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-400'}`}>
                                            {product.stockTotal}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-xs opacity-60">
                                        {product.stockDepositoCliente || 0}
                                    </td>
                                    <td className="p-4 text-center text-xs opacity-60">
                                        {product.stockDepositoCd || 0}
                                    </td>

                                    {/* Extras */}
                                    <td className="p-4">
                                        {product.garantia ? (
                                            <div className="flex items-center gap-1 text-xs text-green-400">
                                                <ShieldCheck size={12} />
                                                {product.garantia}
                                            </div>
                                        ) : <span className="text-[10px] opacity-30">-</span>}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col text-[10px] opacity-60">
                                            {product.peso && <span>{product.peso}kg</span>}
                                        </div>
                                    </td>

                                    <td className="p-4 text-right sticky right-0 bg-[color:var(--bg-secondary)] z-10 border-l border-white/5">
                                        <div className="flex justify-end gap-2">
                                            {product.link && (
                                                <a href={product.link} target="_blank" className="p-2 hover:text-blue-400 transition-colors" title="Link Externo">
                                                    <LinkIcon size={16} />
                                                </a>
                                            )}
                                            <NextLink href={`/admin/products/${product.id}/edit`} className="p-2 hover:text-[color:var(--accent-primary)] transition-colors">
                                                <Pencil size={18} />
                                            </NextLink>
                                            <form action={deleteProduct.bind(null, product.id)}>
                                                <button className="p-2 hover:text-red-400 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <div className="p-12 text-center text-[color:var(--text-tertiary)]">
                            No hay productos registrados.
                        </div>
                    )}
                </div>
            </div>
            <div className="text-xs text-[color:var(--text-tertiary)] text-center">
                Desliza horizontalmente para ver todas las columnas
            </div>

            <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
        </div>
    );
}

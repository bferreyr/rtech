'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Link as LinkIcon, ShieldCheck, AlertCircle, CheckSquare, Square, Loader2 } from 'lucide-react';
import { deleteProduct, deleteProducts, deleteAllProducts } from '@/app/actions/products';

interface ProductTableProps {
    products: any[];
    globalMarkup: number;
    exchangeRate: number;
}

export function ProductTable({ products, globalMarkup, exchangeRate }: ProductTableProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDeleteSelected = async () => {
        if (!confirm(`¿Estás seguro de eliminar ${selectedIds.length} productos seleccionados?`)) return;

        startTransition(async () => {
            await deleteProducts(selectedIds);
            setSelectedIds([]);
        });
    };

    const handleDeleteAll = async () => {
        if (!confirm("ADVERTENCIA: ¿Estás seguro de eliminar TODOS los productos? Esta acción no se puede deshacer.")) return;
        if (!confirm("¿Realmente estás seguro? Se borrará todo el inventario.")) return;

        startTransition(async () => {
            await deleteAllProducts();
            setSelectedIds([]);
        });
    };

    return (
        <div className="space-y-4">
            {/* Bulk Actions Bar */}
            {(selectedIds.length > 0) && (
                <div className="bg-[hsl(var(--accent-primary))]/10 border border-[hsl(var(--accent-primary))]/20 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-[hsl(var(--accent-primary))]">{selectedIds.length} seleccionados</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedIds([])}
                            className="text-sm hover:underline opacity-80"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDeleteSelected}
                            disabled={isPending}
                            className="btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
                            Eliminar Seleccionados
                        </button>
                    </div>
                </div>
            )}

            {/* Global Delete All Button (Always visible if products exist) */}
            {products.length > 0 && selectedIds.length === 0 && (
                <div className="flex justify-end">
                    <button
                        onClick={handleDeleteAll}
                        disabled={isPending}
                        className="text-xs text-red-500 hover:text-red-400 hover:underline flex items-center gap-1 opacity-60 hover:opacity-100 transition-all"
                    >
                        <Trash2 size={12} />
                        Eliminar TODO el inventario
                    </button>
                </div>
            )}

            <div className="rounded-lg border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] overflow-hidden flex flex-col">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[color:var(--bg-tertiary)] border-b border-[color:var(--border-color)]">
                            <tr>
                                <th className="h-12 px-4 w-12 align-middle sticky left-0 bg-[color:var(--bg-tertiary)] z-20 border-r border-white/5">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="p-1 hover:text-[hsl(var(--accent-primary))] transition-colors"
                                    >
                                        {products.length > 0 && selectedIds.length === products.length ? (
                                            <CheckSquare size={18} className="text-[hsl(var(--accent-primary))]" />
                                        ) : (
                                            <Square size={18} className="opacity-50" />
                                        )}
                                    </button>
                                </th>
                                <th className="h-12 px-4 font-medium align-middle">SKU / Códigos</th>
                                <th className="h-12 px-4 font-medium align-middle">Imagen</th>
                                <th className="h-12 px-4 font-medium align-middle sticky left-[48px] bg-[color:var(--bg-tertiary)] z-10 border-r border-white/5">Nombre</th>
                                <th className="h-12 px-4 font-medium align-middle">Marca / Cat</th>
                                <th className="h-12 px-4 font-medium align-middle text-center bg-blue-500/5">Precio Base</th>
                                <th className="h-12 px-4 font-medium align-middle text-center bg-blue-500/5">Impuestos</th>
                                <th className="h-12 px-4 font-medium align-middle text-center bg-green-500/5" title={`Markup Global: ${globalMarkup}%`}>Precio Final (Ars)</th>
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
                                <tr key={product.id} className={`border-b border-[color:var(--border-color)] transition-colors ${selectedIds.includes(product.id) ? 'bg-[hsl(var(--accent-primary))]/5' : 'hover:bg-[color:var(--bg-tertiary)]/50'}`}>
                                    <td className="p-4 sticky left-0 bg-[color:var(--bg-secondary)] z-20 border-r border-white/5">
                                        <button
                                            onClick={() => toggleSelect(product.id)}
                                            className="p-1 hover:text-[hsl(var(--accent-primary))] transition-colors"
                                        >
                                            {selectedIds.includes(product.id) ? (
                                                <CheckSquare size={18} className="text-[hsl(var(--accent-primary))]" />
                                            ) : (
                                                <Square size={18} className="opacity-30" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4">
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
                                    <td className="p-4 font-medium max-w-[200px] truncate sticky left-[48px] bg-[color:var(--bg-secondary)] z-10 border-r border-white/5" title={product.name}>
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
                                        {(() => {
                                            // Cost base
                                            const base = product.pvpUsd ? Number(product.pvpUsd) : (product.precio || product.price);
                                            // Apply global markup
                                            const finalUsd = Number(base) * (1 + globalMarkup / 100);
                                            // Convert to ARS
                                            const finalArs = finalUsd * (product.cotizacion || 0);

                                            // Display logic
                                            return product.cotizacion
                                                ? `$${new Intl.NumberFormat('es-AR').format(finalArs)}`
                                                : 'Sin Cotiz.';
                                        })()}
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
                                            <Link href={`/admin/products/${product.id}/edit`} className="p-2 hover:text-[color:var(--accent-primary)] transition-colors">
                                                <Pencil size={18} />
                                            </Link>
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
        </div>
    );
}

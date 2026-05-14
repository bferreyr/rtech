'use client';

import { useState, useTransition, useCallback } from 'react';
import { Search, Loader2, Package, ChevronUp, ChevronDown } from 'lucide-react';
import { ProductExtranetModal, type ExtranetProduct } from './ProductExtranetModal';

type SortKey = 'name' | 'marca' | 'categoria' | 'stockTotal' | 'priceUsd' | 'priceArs';
type SortDir = 'asc' | 'desc';

function formatUSD(val: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);
}

function formatARS(val: number) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(val);
}

type Props = {
    initialProducts: ExtranetProduct[];
    globalMarkup: number;
    exchangeRate: number;
    total: number;
};

export function ExtranetProductList({ initialProducts, globalMarkup, exchangeRate, total }: Props) {
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState<ExtranetProduct[]>(initialProducts);
    const [filteredTotal, setFilteredTotal] = useState(total);
    const [selectedProduct, setSelectedProduct] = useState<ExtranetProduct | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [isPending, startTransition] = useTransition();

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        startTransition(async () => {
            // Client-side filtering for responsiveness
            const q = value.toLowerCase().trim();
            if (!q) {
                setProducts(initialProducts);
                setFilteredTotal(total);
                return;
            }
            const filtered = initialProducts.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                (p.marca?.toLowerCase().includes(q)) ||
                (p.codigoAlfa?.toLowerCase().includes(q)) ||
                (p.categoria?.toLowerCase().includes(q))
            );
            setProducts(filtered);
            setFilteredTotal(filtered.length);
        });
    }, [initialProducts, total]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const getPrice = (p: ExtranetProduct) => {
        const base = p.pvpUsd ?? p.precio ?? p.price ?? 0;
        return base * (1 + globalMarkup / 100);
    };

    const sorted = [...products].sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        switch (sortKey) {
            case 'name': valA = a.name; valB = b.name; break;
            case 'marca': valA = a.marca ?? ''; valB = b.marca ?? ''; break;
            case 'categoria': valA = a.categoria ?? ''; valB = b.categoria ?? ''; break;
            case 'stockTotal': valA = a.stockTotal; valB = b.stockTotal; break;
            case 'priceUsd': valA = getPrice(a); valB = getPrice(b); break;
            case 'priceArs': valA = getPrice(a) * exchangeRate; valB = getPrice(b) * exchangeRate; break;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortDir === 'asc' ? valA.localeCompare(valB, 'es') : valB.localeCompare(valA, 'es');
        }
        return sortDir === 'asc'
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number);
    });

    const SortIcon = ({ col }: { col: SortKey }) => {
        if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
        return sortDir === 'asc'
            ? <ChevronUp className="w-3 h-3 text-[hsl(var(--accent-primary))]" />
            : <ChevronDown className="w-3 h-3 text-[hsl(var(--accent-primary))]" />;
    };

    return (
        <>
            {/* Search bar */}
            <div className="extranet-search-bar">
                <div className="extranet-search-wrapper">
                    {isPending
                        ? <Loader2 className="extranet-search-icon animate-spin" />
                        : <Search className="extranet-search-icon" />
                    }
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código, marca, rubro..."
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        className="extranet-search-input"
                    />
                </div>
                <span className="extranet-count">
                    {filteredTotal} producto{filteredTotal !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Table */}
            <div className="extranet-table-wrapper">
                <table className="extranet-table">
                    <thead>
                        <tr>
                            <th className="extranet-th" onClick={() => handleSort('name')}>
                                <span>Descripción</span><SortIcon col="name" />
                            </th>
                            <th className="extranet-th extranet-th-code">Cód.</th>
                            <th className="extranet-th extranet-th-code">Cód. Fab.</th>
                            <th className="extranet-th" onClick={() => handleSort('marca')}>
                                <span>Marca</span><SortIcon col="marca" />
                            </th>
                            <th className="extranet-th" onClick={() => handleSort('categoria')}>
                                <span>Rubro</span><SortIcon col="categoria" />
                            </th>
                            <th className="extranet-th extranet-th-right" onClick={() => handleSort('stockTotal')}>
                                <span>Stock</span><SortIcon col="stockTotal" />
                            </th>
                            <th className="extranet-th extranet-th-right" onClick={() => handleSort('priceUsd')}>
                                <span>Precio c/IVA (U$S)</span><SortIcon col="priceUsd" />
                            </th>
                            <th className="extranet-th extranet-th-right" onClick={() => handleSort('priceArs')}>
                                <span>Precio c/IVA (AR$)</span><SortIcon col="priceArs" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="extranet-empty">
                                    <Package className="w-10 h-10 opacity-30 mx-auto mb-3" />
                                    <p>No se encontraron productos</p>
                                    {search && (
                                        <button
                                            onClick={() => handleSearch('')}
                                            className="extranet-clear-search"
                                        >
                                            Limpiar búsqueda
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : sorted.map(product => {
                            const priceUsd = getPrice(product);
                            const priceArs = priceUsd * exchangeRate;
                            const inStock = product.stockTotal > 0;
                            return (
                                <tr
                                    key={product.id}
                                    className="extranet-row"
                                    onClick={() => setSelectedProduct(product)}
                                    title="Ver detalle"
                                >
                                    <td className="extranet-td extranet-td-name">
                                        <span className="extranet-product-name">{product.name}</span>
                                    </td>
                                    <td className="extranet-td extranet-td-code">{product.sku}</td>
                                    <td className="extranet-td extranet-td-code">{product.codigoAlfa ?? '—'}</td>
                                    <td className="extranet-td">{product.marca ?? '—'}</td>
                                    <td className="extranet-td">{product.categoria ?? '—'}</td>
                                    <td className="extranet-td extranet-td-right">
                                        <span className={`extranet-stock ${inStock ? 'in-stock' : 'no-stock'}`}>
                                            {product.stockTotal}
                                        </span>
                                    </td>
                                    <td className="extranet-td extranet-td-right extranet-price">
                                        {formatUSD(priceUsd)}
                                    </td>
                                    <td className="extranet-td extranet-td-right extranet-price-ars">
                                        {formatARS(priceArs)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <ProductExtranetModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                globalMarkup={globalMarkup}
                exchangeRate={exchangeRate}
            />
        </>
    );
}

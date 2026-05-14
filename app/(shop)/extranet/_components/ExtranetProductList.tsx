'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Package, ChevronUp, ChevronDown, ChevronDown as DropIcon, X, Filter } from 'lucide-react';
import { ProductExtranetModal, type ExtranetProduct } from './ProductExtranetModal';

type SortKey = 'name' | 'marca' | 'categoria' | 'stockTotal' | 'priceUsd' | 'priceArs';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 20;

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
    allRubros: string[];
    allMarcas: string[];
    waNumber: string;
};

/* ── Dropdown filter component ── */
function FilterDropdown({
    label,
    options,
    selected,
    onSelect,
    onClear,
}: {
    label: string;
    options: string[];
    selected: string | null;
    onSelect: (val: string) => void;
    onClear: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="extranet-filter-wrap" ref={ref}>
            <button
                className={`extranet-filter-btn ${selected ? 'extranet-filter-btn--active' : ''}`}
                onClick={() => setOpen(v => !v)}
                type="button"
            >
                <Filter className="w-3.5 h-3.5" />
                {selected ? <span className="extranet-filter-selected">{selected}</span> : label}
                {selected
                    ? <X className="w-3 h-3 ml-1 opacity-60" onClick={(e) => { e.stopPropagation(); onClear(); setOpen(false); }} />
                    : <DropIcon className="w-3 h-3 ml-1 opacity-40" />
                }
            </button>

            {open && (
                <div className="extranet-dropdown">
                    <div className="extranet-dropdown-search">
                        <Search className="w-3.5 h-3.5 text-[var(--rt-muted)]" />
                        <input
                            autoFocus
                            className="extranet-dropdown-input"
                            placeholder="Buscar..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="extranet-dropdown-list">
                        {filtered.length === 0 && (
                            <div className="extranet-dropdown-empty">Sin resultados</div>
                        )}
                        {filtered.map(opt => (
                            <button
                                key={opt}
                                className={`extranet-dropdown-item ${selected === opt ? 'extranet-dropdown-item--active' : ''}`}
                                onClick={() => { onSelect(opt); setOpen(false); setSearch(''); }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Sort icon ── */
function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-25 inline ml-1" />;
    return sortDir === 'asc'
        ? <ChevronUp className="w-3 h-3 text-[var(--rt-cyan)] inline ml-1" />
        : <ChevronDown className="w-3 h-3 text-[var(--rt-cyan)] inline ml-1" />;
}

/* ── Main component ── */
export function ExtranetProductList({
    initialProducts,
    globalMarkup,
    exchangeRate,
    total,
    allRubros,
    allMarcas,
    waNumber,
}: Props) {
    const [search, setSearch] = useState('');
    const [selectedRubro, setSelectedRubro] = useState<string | null>(null);
    const [selectedMarca, setSelectedMarca] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [page, setPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<ExtranetProduct | null>(null);

    const getPrice = (p: ExtranetProduct) => {
        const base = p.pvpUsd ?? p.precio ?? p.price ?? 0;
        return base * (1 + globalMarkup / 100);
    };

    // Apply filters
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return initialProducts.filter(p => {
            if (selectedRubro && p.categoria !== selectedRubro) return false;
            if (selectedMarca && p.marca !== selectedMarca) return false;
            if (q && !(
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                (p.marca?.toLowerCase().includes(q)) ||
                (p.codigoAlfa?.toLowerCase().includes(q)) ||
                (p.categoria?.toLowerCase().includes(q))
            )) return false;
            return true;
        });
    }, [initialProducts, search, selectedRubro, selectedMarca]);

    // Sort
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
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
    }, [filtered, sortKey, sortDir, globalMarkup, exchangeRate]);

    // Reset page on filter/sort change
    useEffect(() => { setPage(1); }, [search, selectedRubro, selectedMarca, sortKey, sortDir]);

    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    };

    const hasActiveFilters = !!search || !!selectedRubro || !!selectedMarca;
    const clearAll = () => { setSearch(''); setSelectedRubro(null); setSelectedMarca(null); };

    return (
        <>
            {/* Toolbar */}
            <div className="extranet-toolbar">
                {/* Search */}
                <div className="extranet-search-wrapper">
                    <Search className="extranet-search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código, marca..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="extranet-search-input"
                    />
                    {search && (
                        <button className="extranet-search-clear" onClick={() => setSearch('')}>
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Dropdown filters */}
                <div className="extranet-filters">
                    <FilterDropdown
                        label="Rubro"
                        options={allRubros}
                        selected={selectedRubro}
                        onSelect={setSelectedRubro}
                        onClear={() => setSelectedRubro(null)}
                    />
                    <FilterDropdown
                        label="Marca"
                        options={allMarcas}
                        selected={selectedMarca}
                        onSelect={setSelectedMarca}
                        onClear={() => setSelectedMarca(null)}
                    />
                    {hasActiveFilters && (
                        <button className="extranet-clear-all" onClick={clearAll}>
                            <X className="w-3 h-3" /> Limpiar
                        </button>
                    )}
                </div>

                {/* Count */}
                <span className="extranet-count">
                    {sorted.length} producto{sorted.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Table — full width, no horizontal scroll */}
            <div className="extranet-table-wrapper">
                <table className="extranet-table">
                    <thead>
                        <tr>
                            <th className="extranet-th extranet-th-grow" onClick={() => handleSort('name')}>
                                Descripción <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                            </th>
                            <th className="extranet-th" onClick={() => handleSort('marca')}>
                                Marca <SortIcon col="marca" sortKey={sortKey} sortDir={sortDir} />
                            </th>
                            <th className="extranet-th" onClick={() => handleSort('categoria')}>
                                Rubro <SortIcon col="categoria" sortKey={sortKey} sortDir={sortDir} />
                            </th>
                            <th className="extranet-th extranet-th-num" onClick={() => handleSort('stockTotal')}>
                                Stock <SortIcon col="stockTotal" sortKey={sortKey} sortDir={sortDir} />
                            </th>
                            <th className="extranet-th extranet-th-num" onClick={() => handleSort('priceUsd')}>
                                Precio c/IVA&nbsp;U$S <SortIcon col="priceUsd" sortKey={sortKey} sortDir={sortDir} />
                            </th>
                            <th className="extranet-th extranet-th-num" onClick={() => handleSort('priceArs')}>
                                Precio c/IVA&nbsp;AR$ <SortIcon col="priceArs" sortKey={sortKey} sortDir={sortDir} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="extranet-empty">
                                    <Package className="w-10 h-10 opacity-25 mx-auto mb-3" />
                                    <p>No se encontraron productos</p>
                                    {hasActiveFilters && (
                                        <button onClick={clearAll} className="extranet-clear-search">
                                            Limpiar filtros
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : paginated.map(product => {
                            const priceUsd = getPrice(product);
                            const priceArs = priceUsd * exchangeRate;
                            const inStock = product.stockTotal > 0;
                            return (
                                <tr
                                    key={product.id}
                                    className="extranet-row"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <td className="extranet-td extranet-td-name">
                                        <span className="extranet-product-name">{product.name}</span>
                                        <span className="extranet-product-sku">{product.sku}{product.codigoAlfa ? ` · ${product.codigoAlfa}` : ''}</span>
                                    </td>
                                    <td className="extranet-td">{product.marca ?? '—'}</td>
                                    <td className="extranet-td">{product.categoria ?? '—'}</td>
                                    <td className="extranet-td extranet-td-num">
                                        <span className={`extranet-stock ${inStock ? 'in-stock' : 'no-stock'}`}>
                                            {product.stockTotal}
                                        </span>
                                    </td>
                                    <td className="extranet-td extranet-td-num extranet-price">
                                        {formatUSD(priceUsd)}
                                    </td>
                                    <td className="extranet-td extranet-td-num extranet-price-ars">
                                        {formatARS(priceArs)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="extranet-pagination">
                    <button
                        className="extranet-page-btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        ‹ Anterior
                    </button>
                    <div className="extranet-page-numbers">
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            // Smart window: always show first, last, current ±1
                            let pageNum: number | null = null;
                            if (totalPages <= 7) {
                                pageNum = i + 1;
                            } else {
                                const pages = new Set([1, totalPages, page - 1, page, page + 1].filter(p => p >= 1 && p <= totalPages));
                                const sorted2 = Array.from(pages).sort((a, b) => a - b);
                                pageNum = sorted2[i] ?? null;
                            }
                            if (!pageNum) return null;
                            return (
                                <button
                                    key={pageNum}
                                    className={`extranet-page-num ${pageNum === page ? 'extranet-page-num--active' : ''}`}
                                    onClick={() => setPage(pageNum!)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        className="extranet-page-btn"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        Siguiente ›
                    </button>
                    <span className="extranet-page-info">
                        Página {page} de {totalPages} · {sorted.length} productos
                    </span>
                </div>
            )}

            {/* Modal */}
            <ProductExtranetModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                globalMarkup={globalMarkup}
                exchangeRate={exchangeRate}
                waNumber={waNumber}
            />
        </>
    );
}

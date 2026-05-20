'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Tag, Package, DollarSign, Building2, Layers, FileText, ChevronRight, MessageCircle } from 'lucide-react';

export type ExtranetProduct = {
    id: string;
    sku: string;
    codigoAlfa: string | null;
    name: string;
    description: string | null;
    descripcionDetallada: string | null;
    descripcionLarga: string | null;
    marca: string | null;
    categoria: string | null;
    stockTotal: number;
    pvpUsd: number | null;
    precio: number;
    price: number;
    markup: number | null;
    imageUrl: string | null;
};

type Props = {
    product: ExtranetProduct | null;
    onClose: () => void;
    globalMarkup: number;
    exchangeRate: number;
    waNumber: string;
};

function formatUSD(val: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);
}

function formatARS(val: number) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(val);
}

export function ProductExtranetModal({ product, onClose, globalMarkup, exchangeRate, waNumber }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (product) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [product, handleKeyDown]);

    if (!product || !mounted) return null;

    // Calculate prices
    const baseUsd = product.pvpUsd ?? product.precio ?? product.price ?? 0;
    const priceWithMarkupUsd = baseUsd * (1 + globalMarkup / 100);
    const priceArs = priceWithMarkupUsd * exchangeRate;

    const stockStatus = product.stockTotal > 10
        ? { label: 'En stock', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' }
        : product.stockTotal > 0
            ? { label: `Stock limitado (${product.stockTotal})`, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' }
            : { label: 'Sin stock', color: 'text-red-400 bg-red-400/10 border-red-400/20' };

    // Build WhatsApp message
    const waMessage = encodeURIComponent(
        `Hola! Estoy interesado en el siguiente producto del catálogo:\n\n` +
        `${product.name}\n` +
        `Cód: ${product.sku}${product.codigoAlfa ? ` | Fab: ${product.codigoAlfa}` : ''}\n` +
        `${product.marca ? `Marca: ${product.marca}\n` : ''}` +
        `${product.categoria ? `Rubro: ${product.categoria}\n` : ''}` +
        `\nPor favor, ¿podrían brindarme más información y disponibilidad?`
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

    return (
        <div
            className="extranet-modal-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="extranet-modal-container">
                {/* Header */}
                <div className="extranet-modal-header">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="extranet-modal-icon">
                            <Package className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="extranet-modal-title">{product.name}</h2>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <span className="extranet-badge-code">
                                    <Tag className="w-3 h-3" />
                                    {product.sku}
                                </span>
                                {product.codigoAlfa && (
                                    <span className="extranet-badge-alt">
                                        Fab: {product.codigoAlfa}
                                    </span>
                                )}
                                <span className={`extranet-stock-badge ${stockStatus.color}`}>
                                    {stockStatus.label}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="extranet-modal-close"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="extranet-modal-body">
                    {/* Pricing highlight */}
                    <div className="extranet-price-grid">
                        <div className="extranet-price-card extranet-price-usd">
                            <div className="extranet-price-label">
                                <DollarSign className="w-4 h-4" />
                                Precio c/IVA (U$S)
                            </div>
                            <div className="extranet-price-value">{formatUSD(priceWithMarkupUsd)}</div>
                        </div>
                        <div className="extranet-price-card extranet-price-ars">
                            <div className="extranet-price-label">
                                <span className="font-bold text-sm">$</span>
                                Precio c/IVA (AR$)
                            </div>
                            <div className="extranet-price-value ars">{formatARS(priceArs)}</div>
                        </div>
                    </div>

                    {/* Meta info */}
                    <div className="extranet-meta-grid">
                        {product.marca && (
                            <div className="extranet-meta-item">
                                <Building2 className="w-4 h-4 extranet-meta-icon" />
                                <div>
                                    <div className="extranet-meta-label">Marca</div>
                                    <div className="extranet-meta-value">{product.marca}</div>
                                </div>
                            </div>
                        )}
                        {product.categoria && (
                            <div className="extranet-meta-item">
                                <Layers className="w-4 h-4 extranet-meta-icon" />
                                <div>
                                    <div className="extranet-meta-label">Rubro</div>
                                    <div className="extranet-meta-value">{product.categoria}</div>
                                </div>
                            </div>
                        )}
                        <div className="extranet-meta-item">
                            <Package className="w-4 h-4 extranet-meta-icon" />
                            <div>
                                <div className="extranet-meta-label">Stock</div>
                                <div className="extranet-meta-value">{product.stockTotal} unidades</div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción corta */}
                    {product.description && (
                        <div className="extranet-desc-section">
                            <div className="extranet-desc-header">
                                <FileText className="w-4 h-4" />
                                Descripción
                            </div>
                            <p className="extranet-desc-text">{product.description}</p>
                        </div>
                    )}

                    {/* Descripción Detallada */}
                    {product.descripcionDetallada && (
                        <div className="extranet-desc-section">
                            <div className="extranet-desc-header">
                                <ChevronRight className="w-4 h-4" />
                                Descripción Detallada
                            </div>
                            <p className="extranet-desc-text whitespace-pre-line">{product.descripcionDetallada}</p>
                        </div>
                    )}

                    {/* Descripción Larga */}
                    {product.descripcionLarga && (
                        <div className="extranet-desc-section">
                            <div className="extranet-desc-header">
                                <ChevronRight className="w-4 h-4" />
                                Descripción Larga
                            </div>
                            <div className="extranet-desc-text whitespace-pre-line">{product.descripcionLarga}</div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="extranet-modal-footer">
                    <button onClick={onClose} className="extranet-modal-btn-close">
                        Cerrar
                    </button>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="extranet-modal-btn-wa"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Consultar por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}

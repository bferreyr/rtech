import type { Metadata } from 'next';
import { getMobeProducts } from '@/app/actions/products';
import { getGlobalMarkup, getExchangeRate } from '@/app/actions/settings';
import { ExtranetProductList } from './_components/ExtranetProductList';
import { Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Extranet | Rincón TECH',
    description: 'Catálogo de productos MOBE con precios actualizados en USD y ARS para clientes mayoristas.',
    robots: { index: false, follow: false },
};

export default async function ExtranetPage() {
    const [{ products, pagination }, globalMarkup, rateData] = await Promise.all([
        getMobeProducts({ limit: 2000 }), // Load all for client-side filtering
        getGlobalMarkup(),
        getExchangeRate(),
    ]);

    const exchangeRate = rateData.rate;

    return (
        <div className="extranet-page">
            {/* Header */}
            <div className="extranet-header">
                <div className="extranet-header-inner">
                    <div className="extranet-header-logo">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="extranet-header-title">Extranet — Catálogo MOBE</h1>
                        <p className="extranet-header-sub">
                            Rincón TECH · Precios en USD y ARS actualizados.
                            TC hoy: <strong>${exchangeRate.toLocaleString('es-AR')}</strong>
                        </p>
                    </div>

                    <div className="extranet-header-badges">
                        <div className="extranet-rate-badge">
                            <span className="extranet-rate-label">USD/ARS</span>
                            <span className="extranet-rate-value">
                                ${exchangeRate.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="extranet-markup-badge">
                            <span className="extranet-rate-label">Markup</span>
                            <span className="extranet-rate-value">{globalMarkup}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="extranet-content">
                <ExtranetProductList
                    initialProducts={products as any}
                    globalMarkup={globalMarkup}
                    exchangeRate={exchangeRate}
                    total={pagination.total}
                />
            </div>
        </div>
    );
}

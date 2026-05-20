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

// WhatsApp number (without + or spaces)
const WA_NUMBER = '543425933763';

export default async function ExtranetPage() {
    const [{ products, pagination }, globalMarkup, rateData] = await Promise.all([
        getMobeProducts({ limit: 5000 }), // Load all for client-side filtering & pagination
        getGlobalMarkup(),
        getExchangeRate(),
    ]);

    const exchangeRate = rateData.rate;

    // Build unique filter lists from all products
    const allRubros = Array.from(new Set(
        (products as any[]).map((p: any) => p.categoria).filter(Boolean)
    )).sort() as string[];

    const allMarcas = Array.from(new Set(
        (products as any[]).map((p: any) => p.marca).filter(Boolean)
    )).sort() as string[];

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
                            Rincón TECH · {pagination.total} productos disponibles
                        </p>
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
                    allRubros={allRubros}
                    allMarcas={allMarcas}
                    waNumber={WA_NUMBER}
                />
            </div>
        </div>
    );
}

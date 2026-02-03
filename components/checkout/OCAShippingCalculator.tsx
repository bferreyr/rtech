'use client';

import { useState, useTransition } from 'react';
import { quoteOCAShipment, getOCABranches } from '@/app/actions/oca';
import { Package, MapPin, Truck, Loader2, Building2, Home } from 'lucide-react';

interface OCAShippingCalculatorProps {
    totalWeight: number;
    totalValue: number;
    destinationZip: string;
    onSelectShipping: (option: {
        type: 'puerta-puerta' | 'puerta-sucursal';
        cost: number;
        service: string;
        estimatedDelivery: string;
        branchId?: string;
        branchName?: string;
    }) => void;
    selectedOption?: any;
}

export function OCAShippingCalculator({
    totalWeight,
    totalValue,
    destinationZip,
    onSelectShipping,
    selectedOption
}: OCAShippingCalculatorProps) {
    const [isPending, startTransition] = useTransition();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showBranches, setShowBranches] = useState(false);

    const calculateShipping = () => {
        if (!destinationZip || destinationZip.length < 4) {
            setError('Ingresá un código postal válido');
            return;
        }

        setError(null);
        setQuotes([]);
        setBranches([]);
        setShowBranches(false);

        startTransition(async () => {
            try {
                // Calculate volume (assuming default dimensions if not provided)
                const volume = (totalWeight * 0.001); // Simple volume estimation

                // Quote both services
                const [quotePP, quotePS, branchesResult] = await Promise.all([
                    quoteOCAShipment({
                        destinationZip,
                        weight: totalWeight,
                        volume,
                        declaredValue: totalValue,
                        serviceType: 'puerta-puerta'
                    }),
                    quoteOCAShipment({
                        destinationZip,
                        weight: totalWeight,
                        volume,
                        declaredValue: totalValue,
                        serviceType: 'puerta-sucursal'
                    }),
                    getOCABranches(destinationZip)
                ]);

                const availableQuotes = [];

                if (quotePP.success && quotePP.quote) {
                    availableQuotes.push({
                        type: 'puerta-puerta',
                        ...quotePP.quote
                    });
                }

                if (quotePS.success && quotePS.quote) {
                    availableQuotes.push({
                        type: 'puerta-sucursal',
                        ...quotePS.quote
                    });
                }

                if (availableQuotes.length === 0) {
                    setError('No hay servicios disponibles para este código postal');
                    return;
                }

                setQuotes(availableQuotes);

                // Set branches for Puerta a Sucursal
                if (branchesResult.success && branchesResult.branches.length > 0) {
                    // Filter branches that offer delivery service
                    const deliveryBranches = branchesResult.branches.filter(
                        b => b.services.includes('ENTREGA') || b.services.includes('Entrega')
                    );
                    setBranches(deliveryBranches);
                }
            } catch (err) {
                console.error('Error calculating shipping:', err);
                setError('Error al calcular el envío. Intentá nuevamente.');
            }
        });
    };

    const selectShippingOption = (quote: any) => {
        if (quote.type === 'puerta-sucursal') {
            setShowBranches(true);
        } else {
            onSelectShipping({
                type: quote.type,
                cost: quote.cost,
                service: quote.service,
                estimatedDelivery: quote.estimatedDelivery,
            });
        }
    };

    const selectBranch = (branchId: string) => {
        setSelectedBranch(branchId);
        const branch = branches.find(b => b.id === branchId);
        const quote = quotes.find(q => q.type === 'puerta-sucursal');

        if (branch && quote) {
            onSelectShipping({
                type: 'puerta-sucursal',
                cost: quote.cost,
                service: quote.service,
                estimatedDelivery: quote.estimatedDelivery,
                branchId: branch.id,
                branchName: branch.name,
            });
            setShowBranches(false);
        }
    };

    return (
        <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Opciones de Envío OCA</h2>
            </div>

            {/* Shipping Info */}
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-[hsl(var(--text-tertiary))]">Peso total:</span>
                        <span className="ml-2 font-bold">{totalWeight.toFixed(2)} kg</span>
                    </div>
                    <div>
                        <span className="text-[hsl(var(--text-tertiary))]">Código postal:</span>
                        <span className="ml-2 font-bold">{destinationZip || 'No ingresado'}</span>
                    </div>
                </div>
            </div>

            {/* Calculate Button */}
            {quotes.length === 0 && (
                <button
                    type="button"
                    onClick={calculateShipping}
                    disabled={isPending || !destinationZip}
                    className="btn btn-primary w-full mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Calculando envío...
                        </>
                    ) : (
                        <>
                            <Truck className="w-5 h-5 mr-2" />
                            Calcular Costo de Envío
                        </>
                    )}
                </button>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}

            {/* Shipping Options */}
            {quotes.length > 0 && !showBranches && (
                <div className="space-y-4">
                    <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
                        Seleccioná tu método de envío preferido:
                    </p>

                    {quotes.map((quote, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => selectShippingOption(quote)}
                            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${selectedOption?.type === quote.type && !showBranches
                                    ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${quote.type === 'puerta-puerta'
                                            ? 'bg-blue-500/20'
                                            : 'bg-green-500/20'
                                        }`}>
                                        {quote.type === 'puerta-puerta' ? (
                                            <Home className="w-6 h-6 text-blue-400" />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-green-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">
                                            {quote.service}
                                        </h3>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mb-2">
                                            {quote.type === 'puerta-puerta'
                                                ? 'Entrega a domicilio'
                                                : 'Retirá en sucursal OCA'}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-[hsl(var(--text-tertiary))]">
                                            <MapPin className="w-3 h-3" />
                                            <span>Entrega estimada: {quote.estimatedDelivery}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black gradient-text">
                                        ${quote.cost.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-[hsl(var(--text-tertiary))]">
                                        USD
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setQuotes([]);
                            setBranches([]);
                            setSelectedBranch('');
                        }}
                        className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
                    >
                        Recalcular envío
                    </button>
                </div>
            )}

            {/* Branch Selection */}
            {showBranches && branches.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Seleccioná una sucursal</h3>
                        <button
                            type="button"
                            onClick={() => setShowBranches(false)}
                            className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
                        >
                            Volver
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                        {branches.map((branch) => (
                            <button
                                key={branch.id}
                                type="button"
                                onClick={() => selectBranch(branch.id)}
                                className={`w-full p-4 rounded-lg border transition-all text-left ${selectedBranch === branch.id
                                        ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                        : 'border-white/10 bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <Building2 className="w-5 h-5 text-[hsl(var(--accent-secondary))] flex-shrink-0 mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold mb-1">{branch.name}</h4>
                                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                                            {branch.address}
                                        </p>
                                        {branch.city && (
                                            <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">
                                                {branch.city} - CP {branch.zip}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showBranches && branches.length === 0 && (
                <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-yellow-300 text-sm">
                        No hay sucursales disponibles para este código postal. Por favor, elegí envío a domicilio.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowBranches(false)}
                        className="mt-3 text-sm text-yellow-400 hover:text-yellow-300 underline"
                    >
                        Volver a opciones de envío
                    </button>
                </div>
            )}
        </div>
    );
}

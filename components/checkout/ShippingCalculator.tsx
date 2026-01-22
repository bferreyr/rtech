'use client';

import { useState } from 'react';
import { Loader2, Package, Truck } from 'lucide-react';

interface ShippingOption {
    service: string;
    cost: number;
    estimatedDelivery: string;
    serviceCode: string;
}

interface ShippingCalculatorProps {
    onSelectShipping: (option: ShippingOption) => void;
    selectedOption?: ShippingOption;
    totalWeight: number;
}

export function ShippingCalculator({ onSelectShipping, selectedOption, totalWeight }: ShippingCalculatorProps) {
    const [zipCode, setZipCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<ShippingOption[]>([]);
    const [error, setError] = useState('');

    const calculateShipping = async () => {
        if (!zipCode || zipCode.length !== 4) {
            setError('Ingresa un código postal válido (4 dígitos)');
            return;
        }

        setLoading(true);
        setError('');
        setOptions([]);

        try {
            const response = await fetch('/api/shipping/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destinationZip: zipCode,
                    weight: totalWeight || 1
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al calcular envío');
            }

            setOptions(data.quotes || []);

            if (data.quotes?.length === 0) {
                setError('No hay opciones de envío disponibles para este código postal');
            }
        } catch (err: any) {
            setError(err.message || 'Error al calcular el costo de envío');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
                    <h3 className="text-lg font-bold">Calcular Envío</h3>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Código Postal (ej: 1000)"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-colors"
                        maxLength={4}
                    />
                    <button
                        onClick={calculateShipping}
                        disabled={loading || !zipCode}
                        className="btn btn-primary px-6"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Calcular'
                        )}
                    </button>
                </div>

                {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                )}

                <p className="text-xs text-[hsl(var(--text-secondary))] mt-2">
                    Peso total del pedido: {totalWeight.toFixed(2)} kg
                </p>
            </div>

            {options.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[hsl(var(--text-secondary))]">
                        Opciones de Envío Disponibles
                    </h4>
                    {options.map((option) => (
                        <button
                            key={option.serviceCode}
                            onClick={() => onSelectShipping(option)}
                            className={`w-full glass-card p-4 text-left transition-all hover:border-[hsl(var(--accent-primary))] ${selectedOption?.serviceCode === option.serviceCode
                                    ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                    : ''
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{option.service}</p>
                                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                                            Entrega estimada: {option.estimatedDelivery}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold gradient-text">
                                        ${option.cost.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

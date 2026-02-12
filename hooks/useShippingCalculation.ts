'use client';

import { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface ShippingOption {
    service: string;
    cost: number;
    estimatedDelivery: string;
    serviceCode: string;
}

interface UseShippingCalculationProps {
    weight: number;
}

export function useShippingCalculation({ weight }: UseShippingCalculationProps) {
    const [zipCode, setZipCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<ShippingOption[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);

    const debouncedZipCode = useDebounce(zipCode, 500);

    const calculateShipping = useCallback(async (postalCode: string) => {
        if (!postalCode || postalCode.length !== 4) {
            setError('Código postal inválido');
            setOptions([]);
            return;
        }

        setLoading(true);
        setError(null);
        setOptions([]);

        try {
            const response = await fetch('/api/shipping/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destinationZip: postalCode,
                    weight: weight || 1
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al calcular envío');
            }

            setOptions(data.quotes || []);

            if (data.quotes?.length === 0) {
                setError('No hay opciones de envío disponibles');
            } else if (data.quotes?.length > 0) {
                // Auto-select first option
                setSelectedOption(data.quotes[0]);
            }
        } catch (err: any) {
            setError(err.message || 'Error al calcular el costo de envío');
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, [weight]);

    // Auto-calculate when zip code changes
    const handleZipCodeChange = useCallback((newZipCode: string) => {
        const cleaned = newZipCode.replace(/\D/g, '').slice(0, 4);
        setZipCode(cleaned);

        if (cleaned.length === 4) {
            calculateShipping(cleaned);
        } else {
            setOptions([]);
            setSelectedOption(null);
            setError(null);
        }
    }, [calculateShipping]);

    return {
        zipCode,
        setZipCode: handleZipCodeChange,
        loading,
        options,
        error,
        selectedOption,
        setSelectedOption,
        calculateShipping,
    };
}

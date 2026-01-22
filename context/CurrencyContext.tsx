'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getExchangeRate } from '@/app/actions/settings';

interface CurrencyContextType {
    exchangeRate: number;
    isLoading: boolean;
    formatUSD: (amount: number) => string;
    formatARS: (amount: number) => string;
    toARS: (usdAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [exchangeRate, setExchangeRate] = useState<number>(1000);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            const data = await getExchangeRate();
            setExchangeRate(data.rate);
            setIsLoading(false);
        };
        fetchRate();
    }, []);

    const formatUSD = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatARS = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(amount * exchangeRate);
    };

    const toARS = (usdAmount: number) => {
        return usdAmount * exchangeRate;
    };

    return (
        <CurrencyContext.Provider value={{ exchangeRate, isLoading, formatUSD, formatARS, toARS }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

'use client';

import { useEffect, useState } from 'react';

interface ExchangeRateData {
    rate: number;
    lastUpdated: string;
}

export function useExchangeRate(refreshInterval: number = 60000) {
    const [data, setData] = useState<ExchangeRateData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const response = await fetch('/api/exchange-rate');
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                }
            } catch (error) {
                console.error('Error fetching exchange rate:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch immediately
        fetchRate();

        // Set up interval for auto-refresh
        const interval = setInterval(fetchRate, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    return { data, isLoading };
}

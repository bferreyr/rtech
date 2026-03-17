'use client';

import { useState, useEffect, useTransition } from 'react';
import { getProvinces } from '@/app/actions/locations';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationSelectorProps {
    selectedProvince: string;
    selectedCity: string;
    onProvinceChange: (province: string) => void;
    onCityChange: (city: string) => void;
}

export function LocationSelector({
    selectedProvince,
    selectedCity,
    onProvinceChange,
    onCityChange
}: LocationSelectorProps) {
    const [provinces, setProvinces] = useState<string[]>([]);
    const [isLoadingProvinces, startTransitionProvinces] = useTransition();

    // Load provinces on mount
    useEffect(() => {
        startTransitionProvinces(async () => {
            const data = await getProvinces();
            setProvinces(data);
        });
    }, []);

    // Reset city when province changes
    useEffect(() => {
        onCityChange('');
    }, [selectedProvince]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province Selector */}
            <div>
                <label htmlFor="province" className="block text-sm font-medium mb-2">
                    Provincia *
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-secondary))]">
                        {isLoadingProvinces ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                    </div>
                    <select
                        id="province"
                        name="province"
                        value={selectedProvince}
                        onChange={(e) => onProvinceChange(e.target.value)}
                        required
                        disabled={isLoadingProvinces}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors disabled:opacity-50"
                    >
                        <option value="">Seleccionar provincia</option>
                        {provinces.map((prov) => (
                            <option key={prov} value={prov}>
                                {prov}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* City Input */}
            <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                    Ciudad *
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-secondary))]">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        value={selectedCity}
                        onChange={(e) => onCityChange(e.target.value)}
                        required
                        disabled={!selectedProvince}
                        placeholder={selectedProvince ? 'Ej: Santa Fe' : 'Primero seleccioná una provincia'}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
            </div>
        </div>
    );
}

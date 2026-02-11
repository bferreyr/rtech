'use client';

import { useState, useEffect } from 'react';
import { PROVINCIAS_ARGENTINA, CIUDADES_POR_PROVINCIA } from '@/lib/argentina-locations';
import { MapPin } from 'lucide-react';

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
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        if (selectedProvince) {
            const provinceCities = CIUDADES_POR_PROVINCIA[selectedProvince] || [];
            setCities(provinceCities);
            // Reset city if not in new province
            if (selectedCity && !provinceCities.includes(selectedCity)) {
                onCityChange('');
            }
        } else {
            setCities([]);
            onCityChange('');
        }
    }, [selectedProvince]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province Selector */}
            <div>
                <label htmlFor="province" className="block text-sm font-medium mb-2">
                    Provincia *
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-secondary))]" />
                    <select
                        id="province"
                        name="province"
                        value={selectedProvince}
                        onChange={(e) => onProvinceChange(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors"
                    >
                        <option value="">Seleccionar provincia</option>
                        {PROVINCIAS_ARGENTINA.map((provincia) => (
                            <option key={provincia.id} value={provincia.id}>
                                {provincia.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* City Selector */}
            <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                    Ciudad *
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-secondary))]" />
                    <select
                        id="city"
                        name="city"
                        value={selectedCity}
                        onChange={(e) => onCityChange(e.target.value)}
                        required
                        disabled={!selectedProvince}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Seleccionar ciudad</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useTransition } from 'react';
import { getProvinces, getCities } from '@/app/actions/locations';
import { MapPin, Loader2 } from 'lucide-react';
import type { CityData } from '@/lib/locations-data';

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
    const [cities, setCities] = useState<CityData[]>([]);
    const [isLoadingProvinces, startTransitionProvinces] = useTransition();
    const [isLoadingCities, startTransitionCities] = useTransition();

    // Load provinces on mount
    useEffect(() => {
        startTransitionProvinces(async () => {
            const data = await getProvinces();
            setProvinces(data);
        });
    }, []);

    // Load cities when province changes
    useEffect(() => {
        if (selectedProvince) {
            startTransitionCities(async () => {
                const data = await getCities(selectedProvince);
                setCities(data);

                // Reset city if not in new province list
                // We check if the current selectedCity exists in the new list names
                // Since data is async, we do this check after data loads
                const cityExists = data.some(c => c.name === selectedCity);
                if (selectedCity && !cityExists) {
                    onCityChange('');
                }
            });
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

            {/* City Selector */}
            <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                    Ciudad *
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-secondary))]">
                        {isLoadingCities ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                    </div>
                    <select
                        id="city"
                        name="city"
                        value={selectedCity}
                        onChange={(e) => onCityChange(e.target.value)}
                        required
                        disabled={!selectedProvince || isLoadingCities}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Seleccionar ciudad</option>
                        {cities.map((city, index) => (
                            // Using name + zip + index as key to ensure uniqueness if parsing had duplicates
                            <option key={`${city.name}-${city.zip}-${index}`} value={city.name}>
                                {city.name} ({city.zip})
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

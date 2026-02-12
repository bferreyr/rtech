'use client';

import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

interface PriceRangeFilterProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (range: [number, number]) => void;
}

export function PriceRangeFilter({ min, max, value, onChange }: PriceRangeFilterProps) {
    const { formatUSD, formatARS } = useCurrency();
    const [localValue, setLocalValue] = useState<[number, number]>(value);

    const handleMinChange = (newMin: number) => {
        const newValue: [number, number] = [Math.min(newMin, localValue[1]), localValue[1]];
        setLocalValue(newValue);
    };

    const handleMaxChange = (newMax: number) => {
        const newValue: [number, number] = [localValue[0], Math.max(newMax, localValue[0])];
        setLocalValue(newValue);
    };

    const handleCommit = () => {
        onChange(localValue);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-[hsl(var(--text-primary))]">Precio</h3>

            {/* Dual Range Slider */}
            <div className="relative h-2 bg-white/10 rounded-full">
                <div
                    className="absolute h-full bg-[hsl(var(--accent-primary))] rounded-full"
                    style={{
                        left: `${((localValue[0] - min) / (max - min)) * 100}%`,
                        right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`,
                    }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localValue[0]}
                    onChange={(e) => handleMinChange(Number(e.target.value))}
                    onMouseUp={handleCommit}
                    onTouchEnd={handleCommit}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[hsl(var(--accent-primary))] [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{ zIndex: localValue[0] > max - (max - min) / 4 ? 5 : 3 }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localValue[1]}
                    onChange={(e) => handleMaxChange(Number(e.target.value))}
                    onMouseUp={handleCommit}
                    onTouchEnd={handleCommit}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[hsl(var(--accent-primary))] [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{ zIndex: 4 }}
                />
            </div>

            {/* Price Display */}
            <div className="flex justify-between text-sm">
                <div>
                    <div className="font-semibold text-[hsl(var(--text-primary))]">{formatUSD(localValue[0])}</div>
                    <div className="text-xs text-[hsl(var(--text-tertiary))]">{formatARS(localValue[0])}</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold text-[hsl(var(--text-primary))]">{formatUSD(localValue[1])}</div>
                    <div className="text-xs text-[hsl(var(--text-tertiary))]">{formatARS(localValue[1])}</div>
                </div>
            </div>
        </div>
    );
}

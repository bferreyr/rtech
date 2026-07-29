'use client';

interface StockFilterProps {
    outOfStock?: boolean;
    onChange: (outOfStock: boolean) => void;
}

export function StockFilter({ outOfStock, onChange }: StockFilterProps) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-[hsl(var(--text-primary))]">Disponibilidad</h3>
            <label className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="relative">
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={outOfStock === true}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    <div className={`
                        w-10 h-5 rounded-full transition-colors duration-200 ease-in-out
                        ${outOfStock ? 'bg-[hsl(var(--accent-primary))]' : 'bg-white/10 group-hover:bg-white/20'}
                    `}>
                        <div className={`
                            absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out
                            ${outOfStock ? 'translate-x-5' : 'translate-x-0'}
                        `} />
                    </div>
                </div>
                <span className={`text-sm transition-colors ${outOfStock ? 'text-[hsl(var(--text-primary))] font-medium' : 'text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))]'}`}>
                    Mostrar sin stock
                </span>
            </label>
        </div>
    );
}

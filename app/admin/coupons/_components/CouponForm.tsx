'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CouponFormProps {
    action: (formData: FormData) => Promise<void>;
    defaultValues?: {
        id?: string;
        code?: string;
        description?: string;
        type?: 'PERCENTAGE' | 'FIXED_ARS';
        value?: number;
        minOrderAmount?: number | null;
        maxUses?: number | null;
        oncePerUser?: boolean;
        active?: boolean;
        expiresAt?: Date | string | null;
    };
}

export function CouponForm({ action, defaultValues }: CouponFormProps) {
    const router = useRouter();
    const [type, setType] = useState<'PERCENTAGE' | 'FIXED_ARS'>(defaultValues?.type || 'PERCENTAGE');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await action(formData);
        } catch (e) {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="glass-card p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Código */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">
                        Código del cupón <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="code"
                        defaultValue={defaultValues?.code}
                        required
                        placeholder="Ej: VERANO25"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[hsl(var(--text-tertiary))] focus:outline-none focus:border-[hsl(var(--accent-primary))] focus:ring-1 focus:ring-[hsl(var(--accent-primary))] transition-all uppercase"
                        style={{ textTransform: 'uppercase' }}
                    />
                    <p className="text-xs text-[hsl(var(--text-tertiary))]">Se guardará en mayúsculas automáticamente.</p>
                </div>

                {/* Descripción */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Descripción (opcional)</label>
                    <input
                        type="text"
                        name="description"
                        defaultValue={defaultValues?.description || ''}
                        placeholder="Ej: Descuento de verano para clientes frecuentes"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[hsl(var(--text-tertiary))] focus:outline-none focus:border-[hsl(var(--accent-primary))] focus:ring-1 focus:ring-[hsl(var(--accent-primary))] transition-all"
                    />
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">
                        Tipo de descuento <span className="text-red-400">*</span>
                    </label>
                    <select
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as 'PERCENTAGE' | 'FIXED_ARS')}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[hsl(var(--accent-primary))] focus:ring-1 focus:ring-[hsl(var(--accent-primary))] transition-all"
                    >
                        <option value="PERCENTAGE" className="bg-[hsl(var(--bg-secondary))]">Porcentaje (%)</option>
                        <option value="FIXED_ARS" className="bg-[hsl(var(--bg-secondary))]">Monto fijo (ARS)</option>
                    </select>
                </div>

                {/* Valor */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">
                        {type === 'PERCENTAGE' ? 'Porcentaje (1-100)' : 'Monto a descontar (ARS)'}
                        <span className="text-red-400"> *</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--text-tertiary))] font-medium">
                            {type === 'PERCENTAGE' ? '%' : '$'}
                        </span>
                        <input
                            type="number"
                            name="value"
                            defaultValue={defaultValues?.value}
                            required
                            min={type === 'PERCENTAGE' ? 1 : 1}
                            max={type === 'PERCENTAGE' ? 100 : undefined}
                            step={type === 'PERCENTAGE' ? 1 : 100}
                            placeholder={type === 'PERCENTAGE' ? '15' : '5000'}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[hsl(var(--text-tertiary))] focus:outline-none focus:border-[hsl(var(--accent-primary))] focus:ring-1 focus:ring-[hsl(var(--accent-primary))] transition-all"
                        />
                    </div>
                </div>

                {/* Monto mínimo */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Monto mínimo del pedido (ARS)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--text-tertiary))] font-medium">$</span>
                        <input
                            type="number"
                            name="minOrderAmount"
                            defaultValue={defaultValues?.minOrderAmount ?? ''}
                            min={0}
                            step={100}
                            placeholder="Opcional"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[hsl(var(--text-tertiary))] focus:outline-none focus:border-[hsl(var(--accent-primary))] focus:ring-1 focus:ring-[hsl(var(--accent-primary))] transition-all"
                        />
                    </div>
                    <p className="text-xs text-[hsl(var(--text-tertiary))]">Dejar vacío para sin mínimo.</p>
                </div>

                {/* Límite de usos */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Límite de usos totales</label>
                    <input
                        type="number"
                        name="maxUses"
                        defaultValue={defaultValues?.maxUses ?? ''}
                        min={1}
                        step={1}
                        placeholder="Opcional (vacío = ilimitado)"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[hsl(var(--text-tertiary))] focus:outline-none focus:border-[hsl(var(--accent-primary))] focus:ring-1 focus:ring-[hsl(var(--accent-primary))] transition-all"
                    />
                </div>

                {/* Fecha expiración */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Fecha de expiración</label>
                    <input
                        type="datetime-local"
                        name="expiresAt"
                        defaultValue={defaultValues?.expiresAt
                            ? new Date(defaultValues.expiresAt).toISOString().slice(0, 16)
                            : ''}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[hsl(var(--accent-primary))] focus:ring-1 focus:ring-[hsl(var(--accent-primary))] transition-all"
                    />
                    <p className="text-xs text-[hsl(var(--text-tertiary))]">Dejar vacío para sin expiración.</p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <input
                            type="checkbox"
                            name="oncePerUser"
                            id="oncePerUser"
                            value="true"
                            defaultChecked={defaultValues?.oncePerUser ?? false}
                            className="w-4 h-4 accent-[hsl(var(--accent-primary))]"
                        />
                        <div>
                            <label htmlFor="oncePerUser" className="text-sm font-medium text-white cursor-pointer">
                                Un uso por usuario
                            </label>
                            <p className="text-xs text-[hsl(var(--text-tertiary))]">Cada usuario solo podrá usar este cupón una vez.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <input
                            type="checkbox"
                            name="active"
                            id="active"
                            value="true"
                            defaultChecked={defaultValues?.active ?? true}
                            className="w-4 h-4 accent-[hsl(var(--accent-primary))]"
                        />
                        <div>
                            <label htmlFor="active" className="text-sm font-medium text-white cursor-pointer">
                                Cupón activo
                            </label>
                            <p className="text-xs text-[hsl(var(--text-tertiary))]">Los cupones inactivos no pueden ser utilizados.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-white hover:bg-white/5 transition-all"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Guardando...
                        </>
                    ) : 'Guardar cupón'}
                </button>
            </div>
        </form>
    );
}

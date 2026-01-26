'use client';

import { useState, useTransition, useEffect } from "react";
import { getExchangeRate, updateExchangeRate, getGlobalMarkup, updateGlobalMarkup, getMercadoPagoSettings, updateMercadoPagoSettings } from "@/app/actions/settings";
import { DollarSign, RefreshCw, Save, Loader2, Info, TrendingUp, CreditCard } from "lucide-react";

export default function AdminSettingsPage() {
    const [rate, setRate] = useState<number>(1000);
    const [markup, setMarkup] = useState<number>(30);
    const [mpToken, setMpToken] = useState<string>("");
    const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        async function loadSettings() {
            const [rateData, markupData, mpTokenData] = await Promise.all([
                getExchangeRate(),
                getGlobalMarkup(),
                getMercadoPagoSettings()
            ]);
            setRate(rateData.rate);
            setAutoUpdate(rateData.isAutoUpdate);
            setLastUpdated(rateData.lastUpdated);
            setMarkup(markupData);
            setMpToken(mpTokenData);
        }
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        startTransition(async () => {
            const [rateResult, markupResult, mpResult] = await Promise.all([
                updateExchangeRate(rate, autoUpdate),
                updateGlobalMarkup(markup),
                updateMercadoPagoSettings(mpToken)
            ]);

            if (rateResult.success && markupResult.success && mpResult.success) {
                setStatus({ message: "Configuración guardada correctamente", type: 'success' });
                // Reload settings to get updated lastUpdated time
                const data = await getExchangeRate();
                setLastUpdated(data.lastUpdated);
            } else {
                setStatus({ message: rateResult.error || markupResult.error || mpResult.error || "Error al guardar", type: 'error' });
            }
        });
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold mb-2">Configuración</h1>
                <p className="text-[hsl(var(--text-secondary))]">
                    Gestiona la cotización del dólar, márgenes de ganancia y otros parámetros globales.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Exchange Rate Card */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold">Cotización del Dólar (USD/ARS)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    Valor del Dólar ($1 USD = ?)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-[hsl(var(--text-tertiary))] font-bold">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={rate}
                                        onChange={(e) => setRate(parseFloat(e.target.value))}
                                        disabled={autoUpdate || isPending}
                                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
                                    />
                                </div>
                                {autoUpdate && (
                                    <p className="mt-2 text-xs flex items-center gap-1.5 text-[hsl(var(--accent-secondary))]">
                                        <Info className="w-3 h-3" />
                                        El valor se actualiza automáticamente cada hora.
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 opacity-70">
                                <div className="relative inline-flex items-center cursor-not-allowed">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        readOnly
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-[hsl(var(--accent-primary))] rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:translate-x-full"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">Actualización automática activada</span>
                                    <span className="text-[10px] text-[hsl(var(--text-tertiary))]">Servicio de DolarApi siempre activo</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 flex flex-col justify-center items-center text-center">
                            <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Cotización actual en sitio</p>
                            <p className="text-4xl font-black gradient-text mb-2">${rate.toFixed(2)}</p>
                            <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-tertiary))]">
                                <RefreshCw className={`w-3 h-3 ${isPending ? 'animate-spin' : ''}`} />
                                Última actualización: {lastUpdated ? lastUpdated.toLocaleString() : 'Cargando...'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Markup Card */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Ganancia Global (Markup)</h2>
                            <p className="text-xs text-[hsl(var(--text-secondary))]">Este porcentaje se aplica sobre el costo base de todos los productos.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                Porcentaje de Ganancia (%)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={markup}
                                    onChange={(e) => setMarkup(parseFloat(e.target.value))}
                                    disabled={isPending}
                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-bold text-xl"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-[hsl(var(--text-tertiary))] font-bold">%</span>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-[hsl(var(--text-tertiary))]">
                                Ejemplo: Un producto con costo $100 + 30% markup = $130 precio de venta.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                            <h3 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Importante
                            </h3>
                            <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed">
                                Este valor se usará automáticamente al importar nuevos productos desde Excel. Para productos ya existentes, deberás volver a importar el Excel o actualizarlos manualmente si deseas aplicar el nuevo margen.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mercado Pago Card */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Mercado Pago</h2>
                            <p className="text-xs text-[hsl(var(--text-secondary))]">Configuración de pasarela de pagos.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                Access Token (Producción)
                            </label>
                            <input
                                type="text"
                                value={mpToken}
                                onChange={(e) => setMpToken(e.target.value)}
                                placeholder="APP_USR-..."
                                disabled={isPending}
                                className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-mono text-sm"
                            />
                            <p className="mt-2 text-xs text-[hsl(var(--text-tertiary))]">
                                Copia tu Access Token desde el panel de desarrolladores de Mercado Pago. Si se deja vacío, se intentará usar la variable de entorno del servidor.
                            </p>
                        </div>
                    </div>
                </div>

                {status && (
                    <div className={`p-4 rounded-xl border animate-in fade-in zoom-in duration-300 ${status.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {status.message}
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn btn-primary flex items-center gap-2 h-12 px-8 shadow-lg shadow-[hsl(var(--accent-primary))]/20 hover:shadow-[hsl(var(--accent-primary))]/40 hover:-translate-y-1 transition-all"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Guardar Configuración Global
                    </button>
                </div>
            </form>
        </div>
    );
}

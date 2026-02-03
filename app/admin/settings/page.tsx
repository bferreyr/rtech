'use client';

import { useState, useTransition, useEffect } from "react";
import { getExchangeRate, updateExchangeRate, getGlobalMarkup, updateGlobalMarkup, getModoSettings, updateModoSettings, getOCASettings, updateOCASettings, type ModoSettings, type OCASettings } from "@/app/actions/settings";
import { DollarSign, RefreshCw, Save, Loader2, Info, TrendingUp, CreditCard, Wallet, Truck } from "lucide-react";

export default function AdminSettingsPage() {
    const [rate, setRate] = useState<number>(1000);
    const [markup, setMarkup] = useState<number>(30);

    // MODO State
    const [modoSettings, setModoSettings] = useState<ModoSettings>({
        clientId: "",
        clientSecret: "",
        storeId: ""
    });

    // OCA State
    const [ocaSettings, setOCASettings] = useState<OCASettings>({
        environment: 'testing',
        username: '',
        password: '',
        accountNumber: '',
        cuit: '',
        operativaPP: '',
        operativaPS: '',
        originAddress: '',
        originNumber: '',
        originFloor: '',
        originApartment: '',
        originZip: '',
        originCity: '',
        originProvince: '',
        originEmail: '',
        originObservations: '',
        defaultDimensions: { width: 10, height: 10, depth: 10 },
        defaultTimeframe: '1',
    });

    const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        async function loadSettings() {
            const [rateData, markupData, modoData, ocaData] = await Promise.all([
                getExchangeRate(),
                getGlobalMarkup(),
                getModoSettings(),
                getOCASettings()
            ]);
            setRate(rateData.rate);
            setAutoUpdate(rateData.isAutoUpdate);
            setLastUpdated(rateData.lastUpdated);
            setMarkup(markupData);
            setModoSettings(modoData);
            setOCASettings(ocaData);
        }
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        startTransition(async () => {
            const [rateResult, markupResult, modoResult, ocaResult] = await Promise.all([
                updateExchangeRate(rate, autoUpdate),
                updateGlobalMarkup(markup),
                updateModoSettings(modoSettings),
                updateOCASettings(ocaSettings)
            ]);

            if (rateResult.success && markupResult.success && modoResult.success && ocaResult.success) {
                setStatus({ message: "Configuración guardada correctamente", type: 'success' });
                // Reload settings to get updated lastUpdated time
                const data = await getExchangeRate();
                setLastUpdated(data.lastUpdated);
            } else {
                setStatus({ message: rateResult.error || markupResult.error || modoResult.error || ocaResult.error || "Error al guardar", type: 'error' });
            }
        });
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold mb-2">Configuración</h1>
                <p className="text-[hsl(var(--text-secondary))]">
                    Gestiona la cotización del dólar, márgenes de ganancia y las integraciones con MODO y OCA.
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
                                <LastUpdated time={lastUpdated} />
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

                {/* MODO Payment Integration Card */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Integración MODO</h2>
                            <p className="text-xs text-[hsl(var(--text-secondary))]">Configuración de credenciales para Botón de Pago MODO.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    Client ID
                                </label>
                                <input
                                    type="text"
                                    value={modoSettings.clientId}
                                    onChange={(e) => setModoSettings({ ...modoSettings, clientId: e.target.value })}
                                    placeholder="Ej: 12345678-..."
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    Store ID
                                </label>
                                <input
                                    type="text"
                                    value={modoSettings.storeId}
                                    onChange={(e) => setModoSettings({ ...modoSettings, storeId: e.target.value })}
                                    placeholder="ID de Tienda en MODO"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-mono text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                Client Secret
                            </label>
                            <input
                                type="password"
                                value={modoSettings.clientSecret}
                                onChange={(e) => setModoSettings({ ...modoSettings, clientSecret: e.target.value })}
                                placeholder="***************************"
                                disabled={isPending}
                                className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-mono text-sm"
                            />
                            <p className="mt-2 text-xs text-[hsl(var(--text-tertiary))]">
                                Estas credenciales se encuentran en el portal de desarrolladores de MODO.
                            </p>
                        </div>
                    </div>
                </div>

                {/* OCA Shipping Integration Card */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Integración OCA e-Pak</h2>
                            <p className="text-xs text-[hsl(var(--text-secondary))]">Configuración de envíos con OCA.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Environment Toggle */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <label className="block text-sm font-medium mb-3">Ambiente</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setOCASettings({ ...ocaSettings, environment: 'testing' })}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${ocaSettings.environment === 'testing'
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-white/5 text-[hsl(var(--text-secondary))] hover:bg-white/10'
                                        }`}
                                >
                                    Testing
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOCASettings({ ...ocaSettings, environment: 'production' })}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${ocaSettings.environment === 'production'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/5 text-[hsl(var(--text-secondary))] hover:bg-white/10'
                                        }`}
                                >
                                    Producción
                                </button>
                            </div>
                        </div>

                        {/* Credentials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    Usuario e-Pak
                                </label>
                                <input
                                    type="text"
                                    value={ocaSettings.username}
                                    onChange={(e) => setOCASettings({ ...ocaSettings, username: e.target.value })}
                                    placeholder="test@oca.com.ar"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={ocaSettings.password}
                                    onChange={(e) => setOCASettings({ ...ocaSettings, password: e.target.value })}
                                    placeholder="******"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    Número de Cuenta
                                </label>
                                <input
                                    type="text"
                                    value={ocaSettings.accountNumber}
                                    onChange={(e) => setOCASettings({ ...ocaSettings, accountNumber: e.target.value })}
                                    placeholder="111757/001"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    CUIT
                                </label>
                                <input
                                    type="text"
                                    value={ocaSettings.cuit}
                                    onChange={(e) => setOCASettings({ ...ocaSettings, cuit: e.target.value })}
                                    placeholder="30-53625919-4"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* Operativas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    Operativa Puerta a Puerta
                                </label>
                                <input
                                    type="text"
                                    value={ocaSettings.operativaPP}
                                    onChange={(e) => setOCASettings({ ...ocaSettings, operativaPP: e.target.value })}
                                    placeholder="64665"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--text-secondary))]">
                                    Operativa Puerta a Sucursal
                                </label>
                                <input
                                    type="text"
                                    value={ocaSettings.operativaPS}
                                    onChange={(e) => setOCASettings({ ...ocaSettings, operativaPS: e.target.value })}
                                    placeholder="62342"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/20 transition-all disabled:opacity-50 font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* Origin Address */}
                        <div>
                            <h3 className="text-sm font-bold mb-3">Dirección de Origen</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Calle
                                    </label>
                                    <input
                                        type="text"
                                        value={ocaSettings.originAddress}
                                        onChange={(e) => setOCASettings({ ...ocaSettings, originAddress: e.target.value })}
                                        placeholder="Av. Corrientes"
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Número
                                    </label>
                                    <input
                                        type="text"
                                        value={ocaSettings.originNumber}
                                        onChange={(e) => setOCASettings({ ...ocaSettings, originNumber: e.target.value })}
                                        placeholder="1234"
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Piso (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={ocaSettings.originFloor}
                                        onChange={(e) => setOCASettings({ ...ocaSettings, originFloor: e.target.value })}
                                        placeholder="5"
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Código Postal
                                    </label>
                                    <input
                                        type="text"
                                        value={ocaSettings.originZip}
                                        onChange={(e) => setOCASettings({ ...ocaSettings, originZip: e.target.value })}
                                        placeholder="1043"
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        value={ocaSettings.originCity}
                                        onChange={(e) => setOCASettings({ ...ocaSettings, originCity: e.target.value })}
                                        placeholder="CABA"
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Provincia
                                    </label>
                                    <input
                                        type="text"
                                        value={ocaSettings.originProvince}
                                        onChange={(e) => setOCASettings({ ...ocaSettings, originProvince: e.target.value })}
                                        placeholder="Buenos Aires"
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Email de Contacto
                                    </label>
                                    <input
                                        type="email"
                                        value={ocaSettings.originEmail}
                                        onChange={(e) => setOCASettings({ ...ocaSettings, originEmail: e.target.value })}
                                        placeholder="contacto@tutienda.com"
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Default Dimensions */}
                        <div>
                            <h3 className="text-sm font-bold mb-3">Dimensiones por Defecto (cm)</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Alto
                                    </label>
                                    <input
                                        type="number"
                                        value={ocaSettings.defaultDimensions.height}
                                        onChange={(e) => setOCASettings({
                                            ...ocaSettings,
                                            defaultDimensions: { ...ocaSettings.defaultDimensions, height: parseFloat(e.target.value) }
                                        })}
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Ancho
                                    </label>
                                    <input
                                        type="number"
                                        value={ocaSettings.defaultDimensions.width}
                                        onChange={(e) => setOCASettings({
                                            ...ocaSettings,
                                            defaultDimensions: { ...ocaSettings.defaultDimensions, width: parseFloat(e.target.value) }
                                        })}
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-[hsl(var(--text-tertiary))]">
                                        Profundidad
                                    </label>
                                    <input
                                        type="number"
                                        value={ocaSettings.defaultDimensions.depth}
                                        onChange={(e) => setOCASettings({
                                            ...ocaSettings,
                                            defaultDimensions: { ...ocaSettings.defaultDimensions, depth: parseFloat(e.target.value) }
                                        })}
                                        disabled={isPending}
                                        className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--bg-primary))] border border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all disabled:opacity-50 text-sm"
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-[hsl(var(--text-tertiary))]">
                                Estas dimensiones se usarán para productos sin dimensiones configuradas.
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

// Client helper for hydration matching
function LastUpdated({ time }: { time: Date | null }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return 'Cargando...';
    return time ? time.toLocaleString() : 'Cargando...';
}

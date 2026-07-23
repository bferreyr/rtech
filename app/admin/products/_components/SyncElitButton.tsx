'use client';

import { useState, useTransition } from 'react';
import { RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { syncElitProducts } from '@/app/actions/elit-sync';

export function SyncElitButton() {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSync = async () => {
        if (!confirm('¿Seguro que deseas sincronizar con ELIT API? Esto puede tomar un momento y actualizará tu base de datos con los precios y stock más recientes.')) return;

        setStatus('idle');
        setMessage('');

        startTransition(async () => {
            try {
                const result = await syncElitProducts();
                if (result.success) {
                    setStatus('success');
                    setMessage(result.message || `Exito: ${result.count} productos procesados.`);
                    setTimeout(() => setStatus('idle'), 5000);
                } else {
                    setStatus('error');
                    setMessage(result.error || 'Error crítico al sincronizar');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Error al conectar con la API de ELIT');
            }
        });
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleSync}
                disabled={isPending}
                className={`btn btn-outline flex items-center gap-2 cursor-pointer ${isPending ? 'opacity-50 pointer-events-none' : ''
                    } ${status === 'success' ? 'border-green-500 text-green-500' :
                        status === 'error' ? 'border-red-500 text-red-500' : ''
                    }`}
            >
                {isPending ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Sincronizando...
                    </>
                ) : status === 'success' ? (
                    <>
                        <CheckCircle2 size={20} />
                        ¡Listo!
                    </>
                ) : status === 'error' ? (
                    <>
                        <AlertCircle size={20} />
                        Error
                    </>
                ) : (
                    <>
                        <RefreshCw size={20} />
                        Sync ELIT API
                    </>
                )}
            </button>

            {message && status !== 'idle' && (
                <div className={`absolute top-full mt-2 right-0 w-80 p-3 rounded-lg text-xs font-medium backdrop-blur-md border animate-in fade-in slide-in-from-top-2 z-10 shadow-xl max-h-64 overflow-y-auto ${status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    <p className="font-bold mb-1">{message}</p>
                </div>
            )}
        </div>
    );
}

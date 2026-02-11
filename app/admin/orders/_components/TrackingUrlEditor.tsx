'use client';

import { useState } from 'react';
import { Truck, Save, X, ExternalLink } from 'lucide-react';

interface TrackingUrlEditorProps {
    orderId: string;
    initialUrl: string | null;
}

export function TrackingUrlEditor({ orderId, initialUrl }: TrackingUrlEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [trackingUrl, setTrackingUrl] = useState(initialUrl || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');
        setIsSaving(true);

        try {
            const response = await fetch(`/api/orders/${orderId}/tracking`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingUrl: trackingUrl || null })
            });

            if (!response.ok) {
                throw new Error('Error al guardar');
            }

            setIsEditing(false);
            window.location.reload(); // Refresh to show updated data
        } catch (err) {
            setError('Error al guardar el link de seguimiento');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border-color)] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-[color:var(--text-secondary)]">
                <Truck size={18} />
                <h3 className="font-semibold">Seguimiento de Correo Argentino</h3>
            </div>

            {!isEditing ? (
                <div className="space-y-3">
                    {trackingUrl ? (
                        <div className="flex items-center gap-3">
                            <a
                                href={trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-sm text-[color:var(--accent-primary)] hover:underline flex items-center gap-2"
                            >
                                <ExternalLink size={14} />
                                {trackingUrl}
                            </a>
                        </div>
                    ) : (
                        <p className="text-sm text-[color:var(--text-secondary)] italic">
                            No hay link de seguimiento configurado
                        </p>
                    )}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-[color:var(--accent-primary)] hover:underline"
                    >
                        {trackingUrl ? 'Editar link' : 'Agregar link de seguimiento'}
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <input
                        type="url"
                        value={trackingUrl}
                        onChange={(e) => setTrackingUrl(e.target.value)}
                        placeholder="https://www.correoargentino.com.ar/seguimiento/..."
                        className="w-full px-3 py-2 bg-[color:var(--bg-tertiary)] border border-[color:var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]"
                    />
                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-[color:var(--accent-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 text-sm"
                        >
                            <Save size={14} />
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setTrackingUrl(initialUrl || '');
                                setError('');
                            }}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-[color:var(--bg-tertiary)] rounded-lg hover:bg-[color:var(--bg-secondary)] text-sm"
                        >
                            <X size={14} />
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

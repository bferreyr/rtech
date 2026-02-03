'use client';

import { useState, useTransition } from 'react';
import { getOCALabel, getOCATracking, cancelOCAShipment } from '@/app/actions/oca';
import { Download, RefreshCw, XCircle, Loader2, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface ShipmentActionsProps {
    shipmentId: string;
    trackingNumber: string | null;
    carrier: string;
    status: string;
    ocaOrderId: string | null;
}

export function ShipmentActions({
    shipmentId,
    trackingNumber,
    carrier,
    status,
    ocaOrderId
}: ShipmentActionsProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const isOCA = carrier === 'OCA';
    const canCancel = status !== 'DELIVERED' && status !== 'CANCELLED' && status !== 'FAILED';

    const handleDownloadLabel = async (format: 'html' | 'pdf' = 'pdf') => {
        if (!isOCA || !ocaOrderId) {
            setMessage({ type: 'error', text: 'No hay etiqueta disponible' });
            return;
        }

        setMessage(null);
        startTransition(async () => {
            const result = await getOCALabel(shipmentId, format);

            if (result.success && result.label) {
                // Create download link
                const blob = format === 'pdf'
                    ? await fetch(`data:application/pdf;base64,${result.label}`).then(r => r.blob())
                    : new Blob([result.label], { type: 'text/html' });

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `etiqueta-${trackingNumber || shipmentId}.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                setMessage({ type: 'success', text: 'Etiqueta descargada correctamente' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al descargar etiqueta' });
            }
        });
    };

    const handleUpdateTracking = async () => {
        if (!trackingNumber) {
            setMessage({ type: 'error', text: 'No hay número de tracking' });
            return;
        }

        setMessage(null);
        startTransition(async () => {
            if (isOCA) {
                const result = await getOCATracking(trackingNumber);

                if (result.success) {
                    setMessage({ type: 'success', text: 'Tracking actualizado correctamente' });
                    // Refresh the page to show updated data
                    window.location.reload();
                } else {
                    setMessage({ type: 'error', text: result.error || 'Error al actualizar tracking' });
                }
            }
        });
    };

    const handleCancelShipment = async () => {
        if (!canCancel) return;

        setMessage(null);
        startTransition(async () => {
            if (isOCA) {
                const result = await cancelOCAShipment(shipmentId);

                if (result.success) {
                    setMessage({ type: 'success', text: 'Envío anulado correctamente' });
                    setShowCancelConfirm(false);
                    // Refresh the page
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    setMessage({ type: 'error', text: result.error || 'Error al anular envío' });
                }
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Action Buttons */}
            <div className="glass-card p-6">
                <h3 className="font-bold mb-4">Acciones</h3>
                <div className="space-y-3">
                    {/* Download Label */}
                    {isOCA && ocaOrderId && (
                        <div className="space-y-2">
                            <button
                                onClick={() => handleDownloadLabel('pdf')}
                                disabled={isPending}
                                className="btn btn-primary w-full disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                )}
                                Descargar Etiqueta PDF
                            </button>
                            <button
                                onClick={() => handleDownloadLabel('html')}
                                disabled={isPending}
                                className="btn btn-secondary w-full disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <FileText className="w-4 h-4 mr-2" />
                                )}
                                Descargar Etiqueta HTML
                            </button>
                        </div>
                    )}

                    {/* Update Tracking */}
                    {trackingNumber && (
                        <button
                            onClick={handleUpdateTracking}
                            disabled={isPending}
                            className="btn btn-secondary w-full disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Actualizar Tracking
                        </button>
                    )}

                    {/* Cancel Shipment */}
                    {canCancel && !showCancelConfirm && (
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            disabled={isPending}
                            className="btn w-full bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Anular Envío
                        </button>
                    )}

                    {/* Cancel Confirmation */}
                    {showCancelConfirm && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 space-y-3">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-red-400">¿Confirmar anulación?</p>
                                    <p className="text-sm text-red-300/80 mt-1">
                                        Esta acción no se puede deshacer. El envío será cancelado en OCA.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancelShipment}
                                    disabled={isPending}
                                    className="btn flex-1 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <XCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Sí, Anular
                                </button>
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    disabled={isPending}
                                    className="btn flex-1 btn-secondary"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Messages */}
            {message && (
                <div className={`p-4 rounded-lg border animate-in fade-in zoom-in duration-300 ${message.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                    }`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                        <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                            {message.text}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

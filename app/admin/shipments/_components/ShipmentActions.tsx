'use client';

import { useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface ShipmentActionsProps {
    shipmentId: string;
    trackingNumber: string | null;
    carrier: string;
    status: string;
}

export function ShipmentActions({
    shipmentId,
    trackingNumber,
    carrier,
    status
}: ShipmentActionsProps) {
    return (
        <div className="space-y-4">
            {/* Action Buttons */}
            <div className="glass-card p-6">
                <h3 className="font-bold mb-4">Acciones</h3>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-yellow-200">
                                Las funciones de gesti\u00f3n de env\u00edos est\u00e1n temporalmente deshabilitadas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

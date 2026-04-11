'use client';

import { useState } from 'react';
import { updateWarrantyStatus } from '@/app/actions/warranty';
import { WarrantyRequest, WarrantyStatus } from '@prisma/client';

interface Props {
    warranties: WarrantyRequest[];
}

export function WarrantyList({ warranties: initialWarranties }: Props) {
    const [warranties, setWarranties] = useState(initialWarranties);
    const [updatingParams, setUpdatingParams] = useState<string | null>(null);

    const handleStatusChange = async (id: string, status: WarrantyStatus) => {
        setUpdatingParams(id);
        const res = await updateWarrantyStatus(id, status);
        if (res.success && res.warranty) {
            setWarranties(prev => prev.map(w => w.id === id ? res.warranty! : w));
        }
        setUpdatingParams(null);
    };

    const getStatusColor = (status: WarrantyStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'RESOLVED': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-white/10 text-white border-white/20';
        }
    };

    const StatusBadge = ({ status }: { status: WarrantyStatus }) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(status)}`}>
            {status}
        </span>
    );

    return (
        <div className="bg-[hsl(var(--bg-secondary))] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 border-b border-white/10 text-[hsl(var(--text-secondary))] text-sm">
                            <th className="p-4 font-bold">Fecha / ID</th>
                            <th className="p-4 font-bold">Cliente</th>
                            <th className="p-4 font-bold">Tipo / Producto</th>
                            <th className="p-4 font-bold">Detalles</th>
                            <th className="p-4 font-bold">Estado</th>
                            <th className="p-4 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {warranties.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-[hsl(var(--text-secondary))]">
                                    No hay solicitudes de garantía registradas.
                                </td>
                            </tr>
                        ) : (
                            warranties.map((warranty) => (
                                <tr key={warranty.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 align-top">
                                        <div className="text-sm font-medium">
                                            {new Date(warranty.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-[hsl(var(--text-secondary))] mt-1">
                                            #{warranty.id.slice(-6)}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-sm">{warranty.contactName}</div>
                                        <div className="text-xs text-[hsl(var(--accent-primary))] mt-1">
                                            {warranty.contactEmail}
                                        </div>
                                        <div className="text-xs text-[hsl(var(--text-secondary))] mt-0.5">
                                            {warranty.contactPhone}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 text-xs font-black rounded ${warranty.type === 'DOA' ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                {warranty.type}
                                            </span>
                                        </div>
                                        <div className="text-sm">SKU: <span className="font-bold">{warranty.productSku}</span></div>
                                        <div className="text-xs text-[hsl(var(--text-secondary))]">SN: {warranty.serialNumber}</div>
                                        {warranty.type === 'DOA' && warranty.invoiceDate && (
                                            <div className="text-xs text-orange-400 mt-1">
                                                Fac: {new Date(warranty.invoiceDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="text-xs text-[hsl(var(--text-secondary))] max-w-xs break-words">
                                            {warranty.problemDescription}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <StatusBadge status={warranty.status} />
                                    </td>
                                    <td className="p-4 align-top text-right">
                                        <select
                                            disabled={updatingParams === warranty.id}
                                            value={warranty.status}
                                            onChange={(e) => handleStatusChange(warranty.id, e.target.value as WarrantyStatus)}
                                            className="bg-[hsl(var(--bg-primary))] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-[hsl(var(--accent-primary))] disabled:opacity-50"
                                        >
                                            <option value="PENDING">Pendiente</option>
                                            <option value="IN_PROGRESS">En Progreso</option>
                                            <option value="RESOLVED">Resuelto</option>
                                            <option value="REJECTED">Rechazado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

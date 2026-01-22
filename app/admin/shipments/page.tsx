import { getAllShipments } from '@/app/actions/shipping';
import { Package, Truck, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ShipmentsPage() {
    const result = await getAllShipments();
    const shipments = result.success ? result.shipments || [] : [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'IN_TRANSIT':
            case 'OUT_FOR_DELIVERY':
                return <Truck className="w-5 h-5 text-blue-400" />;
            case 'FAILED':
            case 'CANCELLED':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'text-green-400 bg-green-400/10';
            case 'IN_TRANSIT':
            case 'OUT_FOR_DELIVERY':
                return 'text-blue-400 bg-blue-400/10';
            case 'FAILED':
            case 'CANCELLED':
                return 'text-red-400 bg-red-400/10';
            default:
                return 'text-yellow-400 bg-yellow-400/10';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Envíos</h1>
                    <p className="text-[hsl(var(--text-secondary))]">
                        Gestiona todos los envíos de Correo Argentino
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--text-secondary))]">Pendientes</p>
                            <p className="text-2xl font-bold">
                                {shipments.filter(s => s.status === 'PENDING' || s.status === 'LABEL_GENERATED').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-400/20 flex items-center justify-center">
                            <Truck className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--text-secondary))]">En Tránsito</p>
                            <p className="text-2xl font-bold">
                                {shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-400/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--text-secondary))]">Entregados</p>
                            <p className="text-2xl font-bold">
                                {shipments.filter(s => s.status === 'DELIVERED').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--text-secondary))]">Total</p>
                            <p className="text-2xl font-bold">{shipments.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipments Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    Tracking
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    Orden
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    Cliente
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    Servicio
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    Estado
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    Fecha
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--text-secondary))]">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center p-12">
                                        <Package className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--text-tertiary))]" />
                                        <p className="text-[hsl(var(--text-secondary))]">
                                            No hay envíos registrados
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                shipments.map((shipment: any) => (
                                    <tr key={shipment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <code className="text-sm bg-white/5 px-2 py-1 rounded">
                                                {shipment.trackingNumber || 'Pendiente'}
                                            </code>
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/admin/orders/${shipment.orderId}`}
                                                className="text-[hsl(var(--accent-primary))] hover:underline"
                                            >
                                                #{shipment.orderId.slice(0, 8)}
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium">{shipment.order.user.name}</p>
                                                <p className="text-sm text-[hsl(var(--text-secondary))]">
                                                    {shipment.order.user.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm">{shipment.service}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(shipment.status)}
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
                                                    {shipment.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-[hsl(var(--text-secondary))]">
                                            {new Date(shipment.createdAt).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/admin/shipments/${shipment.id}`}
                                                className="text-sm text-[hsl(var(--accent-primary))] hover:underline"
                                            >
                                                Ver Detalles
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

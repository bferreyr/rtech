import { getWarrantyRequests } from '@/app/actions/warranty';
import { WarrantyList } from './_components/WarrantyList';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
    title: 'RMA y Garantías | Admin',
};

export default async function AdminWarrantyPage() {
    const res = await getWarrantyRequests();
    const warranties = res.success && res.warranties ? res.warranties : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        <ShieldAlert className="text-[hsl(var(--accent-primary))]" size={32} />
                        Gestión de Garantías (RMA)
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] mt-1">
                        Administra las solicitudes de garantía y DOA de los clientes.
                    </p>
                </div>
            </div>

            <WarrantyList warranties={warranties} />
        </div>
    );
}

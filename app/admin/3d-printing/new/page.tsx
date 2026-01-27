import { prisma } from '@/lib/prisma';
import NewPrintingJobForm from './NewJobForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewPrintingJobPage() {
    // Fetch all users to populate the select
    const users = await prisma.user.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, email: true }
    });

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/admin/3d-printing"
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nuevo Trabajo de Impresión</h1>
                    <p className="text-[hsl(var(--text-secondary))]">Cargar modelo para cliente</p>
                </div>
            </div>

            <NewPrintingJobForm users={users} />
        </div>
    );
}

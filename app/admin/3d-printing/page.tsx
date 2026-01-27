import Link from 'next/link';
import { getPrintingJobs } from '@/app/actions/printing-3d';
import { Plus, Box, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function PrintingJobsPage() {
    const jobs = await getPrintingJobs();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Impresión 3D</h1>
                    <p className="text-[hsl(var(--text-secondary))]">Gestión de trabajos y modelos</p>
                </div>
                <Link
                    href="/admin/3d-printing/new"
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Trabajo
                </Link>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/5 text-left text-sm font-medium text-[hsl(var(--text-secondary))]">
                        <tr>
                            <th className="p-4">Trabajo</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Archivo</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {jobs.map((job: any) => (
                            <tr key={job.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-primary))]/20 flex items-center justify-center text-[hsl(var(--accent-primary))]">
                                            <Box className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{job.title}</p>
                                            <p className="text-xs text-[hsl(var(--text-tertiary))] line-clamp-1">{job.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div>
                                        <p className="text-sm">{job.user.name}</p>
                                        <p className="text-xs text-[hsl(var(--text-tertiary))]">{job.user.email}</p>
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-mono text-[hsl(var(--text-secondary))]">
                                    {job.fileName}
                                </td>
                                <td className="p-4 text-sm font-medium">
                                    {job.price ? formatCurrency(Number(job.price)) : '-'}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${job.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        job.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {job.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> :
                                            job.status === 'IN_PROGRESS' ? <Clock className="w-3 h-3" /> :
                                                <Clock className="w-3 h-3" />}
                                        {job.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-[hsl(var(--text-secondary))]">
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-[hsl(var(--text-secondary))]">
                                    <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No hay trabajos de impresión registrados</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

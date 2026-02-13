import { getUserPrintingJobs } from '@/app/actions/printing-3d';
import { auth } from '@/auth';
import { ModelViewer } from '@/components/3d/ModelViewer';
import { Box, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function User3DModelsPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const jobs = await getUserPrintingJobs(session.user.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Mis Modelos 3D</h1>
                <p className="text-[hsl(var(--text-secondary))]">Visualiza el estado de tus impresiones y diseños.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job: any) => (
                    <div key={job.id} className="glass-card p-6 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{job.title}</h3>
                                <p className="text-sm text-[hsl(var(--text-secondary))]">{job.description}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${job.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                job.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                }`}>
                                {job.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> :
                                    job.status === 'IN_PROGRESS' ? <Clock className="w-3 h-3" /> :
                                        <Clock className="w-3 h-3" />}
                                {job.status}
                            </span>
                        </div>

                        {/* 3D Viewer Integration */}
                        <div className="rounded-xl overflow-hidden bg-black/50 border border-white/5">
                            <ModelViewer url={job.fileUrl} className="h-[300px]" />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm">
                            <div className="flex items-center gap-2 text-[hsl(var(--text-secondary))]">
                                <Box className="w-4 h-4" />
                                <span className="font-mono text-xs">{job.fileName}</span>
                            </div>
                            {job.price && (
                                <div className="font-bold text-lg text-[hsl(var(--accent-primary))]">
                                    {formatCurrency(Number(job.price))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {jobs.length === 0 && (
                    <div className="col-span-full p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                        <Box className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--text-disabled))]" />
                        <h3 className="text-lg font-medium mb-2">No hay modelos cargados</h3>
                        <p className="text-[hsl(var(--text-secondary))]">
                            Cuando envíes archivos para impresión, aparecerán aquí para que puedas visualizarlos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

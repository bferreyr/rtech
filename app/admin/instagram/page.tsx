import { prisma } from '@/lib/prisma';
import { ScheduleForm } from './_components/ScheduleForm';
import { ScheduleList } from './_components/ScheduleList';

export const metadata = {
    title: 'Automatización Instagram | Rincón Tech',
};

export default async function InstagramAdminPage() {
    const schedules = await prisma.instagramSchedule.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-['Outfit'] text-white">Instagram Bot</h1>
                <p className="text-[color:var(--text-secondary)] mt-1">
                    Configura publicaciones automáticas para Feed e Historias.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Nueva Regla</h2>
                        <ScheduleForm />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Reglas Activas</h2>
                        <ScheduleList initialSchedules={schedules} />
                    </div>
                </div>
            </div>
        </div>
    );
}

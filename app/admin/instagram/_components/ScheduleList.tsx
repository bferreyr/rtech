'use client';

import { deleteSchedule, toggleSchedule } from '@/app/actions/instagram-schedule';
import { Trash2, Clock, CalendarDays } from 'lucide-react';

interface Props {
    initialSchedules: any[];
}

export function ScheduleList({ initialSchedules }: Props) {
    const handleToggle = async (id: string, current: boolean) => {
        await toggleSchedule(id, !current);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta regla?')) return;
        await deleteSchedule(id);
    };

    if (initialSchedules.length === 0) {
        return (
            <div className="text-[color:var(--text-tertiary)] text-center py-8">
                No hay reglas configuradas.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {initialSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            {schedule.cronExpression ? <Clock size={20} /> : <CalendarDays size={20} />}
                        </div>
                        <div>
                            <div className="font-bold text-white">
                                {schedule.cronExpression ? 'Rutina Semanal' : 'Fecha Específica'}
                            </div>
                            <div className="text-xs text-[color:var(--text-tertiary)] flex flex-col gap-0.5">
                                {schedule.cronExpression && <span>Cron: {schedule.cronExpression}</span>}
                                {schedule.specificDate && <span>Fecha: {new Date(schedule.specificDate).toLocaleString()}</span>}
                                <span>Publicar: {schedule.postType}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    className="sr-only" 
                                    checked={schedule.isActive}
                                    onChange={() => handleToggle(schedule.id, schedule.isActive)}
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${schedule.isActive ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${schedule.isActive ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                        </label>
                        <button 
                            onClick={() => handleDelete(schedule.id)}
                            className="p-2 text-[color:var(--text-tertiary)] hover:text-red-400 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

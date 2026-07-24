'use client';

import { useState } from 'react';
import { createSchedule } from '@/app/actions/instagram-schedule';

export function ScheduleForm() {
    const [type, setType] = useState('RECURRING'); // RECURRING, SPECIFIC
    const [postType, setPostType] = useState('BOTH');
    
    // Simple state for UI
    const [dayOfWeek, setDayOfWeek] = useState('*');
    const [hour, setHour] = useState('18');
    
    const [specificDate, setSpecificDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data: any = { postType };
            
            if (type === 'RECURRING') {
                // cron format: minute hour dayOfMonth month dayOfWeek
                data.cronExpression = `0 ${hour} * * ${dayOfWeek}`;
            } else {
                if (!specificDate) return alert('Debes seleccionar una fecha.');
                data.specificDate = new Date(specificDate);
            }

            const res = await createSchedule(data);
            if (res.success) {
                alert('Regla creada exitosamente');
            } else {
                alert(`Error: ${res.error}`);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-[color:var(--text-tertiary)] uppercase tracking-wider mb-2">
                    Tipo de Regla
                </label>
                <select 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-[color:var(--bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                    <option value="RECURRING">Rutina Semanal (Día y Hora)</option>
                    <option value="SPECIFIC">Fecha Específica (Día Especial)</option>
                </select>
            </div>

            {type === 'RECURRING' && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-[color:var(--text-tertiary)] uppercase tracking-wider mb-2">
                            Día
                        </label>
                        <select 
                            value={dayOfWeek} 
                            onChange={e => setDayOfWeek(e.target.value)}
                            className="w-full bg-[color:var(--bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="*">Todos los días</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                            <option value="0">Domingo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[color:var(--text-tertiary)] uppercase tracking-wider mb-2">
                            Hora
                        </label>
                        <input 
                            type="number" 
                            min="0" max="23"
                            value={hour}
                            onChange={e => setHour(e.target.value)}
                            className="w-full bg-[color:var(--bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                </div>
            )}

            {type === 'SPECIFIC' && (
                <div>
                    <label className="block text-xs font-bold text-[color:var(--text-tertiary)] uppercase tracking-wider mb-2">
                        Fecha y Hora
                    </label>
                    <input 
                        type="datetime-local" 
                        value={specificDate}
                        onChange={e => setSpecificDate(e.target.value)}
                        className="w-full bg-[color:var(--bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                    />
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-[color:var(--text-tertiary)] uppercase tracking-wider mb-2">
                    Qué publicar
                </label>
                <select 
                    value={postType} 
                    onChange={e => setPostType(e.target.value)}
                    className="w-full bg-[color:var(--bg-tertiary)] border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                    <option value="FEED">Sólo Feed</option>
                    <option value="STORY">Sólo Historia</option>
                    <option value="BOTH">Ambos</option>
                </select>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {isSubmitting ? 'Guardando...' : 'Crear Regla'}
            </button>
        </form>
    );
}

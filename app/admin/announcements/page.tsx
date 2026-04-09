'use client';

import { useState, useEffect } from 'react';
import {
    Megaphone, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
    Tag, Sparkles, Flame, Info, Zap, X, Save, Loader2
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/ui/AdminHeader';

type AnnouncementType = 'DISCOUNT' | 'NEW' | 'OFFER' | 'INFO' | 'URGENT';

interface Announcement {
    id: string;
    title: string;
    subtitle: string | null;
    type: AnnouncementType;
    active: boolean;
    startsAt: string | null;
    expiresAt: string | null;
    order: number;
}

const TYPE_OPTIONS: {
    value: AnnouncementType;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
}[] = [
    { value: 'DISCOUNT', label: 'Descuento', icon: Tag, color: 'text-orange-400' },
    { value: 'NEW', label: 'Nuevo', icon: Sparkles, color: 'text-emerald-400' },
    { value: 'OFFER', label: 'Oferta', icon: Flame, color: 'text-yellow-400' },
    { value: 'INFO', label: 'Info', icon: Info, color: 'text-blue-400' },
    { value: 'URGENT', label: 'Urgente', icon: Zap, color: 'text-red-400' },
];

const TYPE_BADGE: Record<AnnouncementType, string> = {
    DISCOUNT: 'bg-orange-500/15 text-orange-400 border border-orange-500/25',
    NEW:      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    OFFER:    'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
    INFO:     'bg-blue-500/15 text-blue-400 border border-blue-500/25',
    URGENT:   'bg-red-500/15 text-red-400 border border-red-500/25',
};

const EMPTY = {
    title: '', subtitle: '', type: 'INFO' as AnnouncementType,
    active: true, startsAt: '', expiresAt: '', order: 0,
};

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/announcements/admin');
            if (res.ok) setAnnouncements(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };

    const openEdit = (a: Announcement) => {
        setForm({
            title: a.title,
            subtitle: a.subtitle ?? '',
            type: a.type,
            active: a.active,
            startsAt: a.startsAt ? a.startsAt.slice(0, 16) : '',
            expiresAt: a.expiresAt ? a.expiresAt.slice(0, 16) : '',
            order: a.order,
        });
        setEditingId(a.id);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        try {
            const payload = { ...form, startsAt: form.startsAt || null, expiresAt: form.expiresAt || null };
            if (editingId) {
                await fetch(`/api/announcements/${editingId}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
                });
            } else {
                await fetch('/api/announcements', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
                });
            }
            setShowForm(false);
            await load();
        } finally { setSaving(false); }
    };

    const handleToggle = async (a: Announcement) => {
        await fetch(`/api/announcements/${a.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...a, active: !a.active }),
        });
        await load();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este anuncio?')) return;
        setDeletingId(id);
        try {
            await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
            await load();
        } finally { setDeletingId(null); }
    };

    const TypeIcon = ({ type, size = 12 }: { type: AnnouncementType; size?: number }) => {
        const opt = TYPE_OPTIONS.find(o => o.value === type)!;
        return <opt.icon size={size} />;
    };

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Anuncios"
                description="Gestioná los banners que se muestran en la tienda (descuentos, novedades, alertas)"
            />

            {/* Topbar */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-[hsl(var(--text-secondary))]">
                    {announcements.filter(a => a.active).length} activo{announcements.filter(a => a.active).length !== 1 ? 's' : ''} de {announcements.length} total
                </p>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md"
                >
                    <Plus size={15} />
                    Nuevo Anuncio
                </button>
            </div>

            {/* ─── Modal form ─── */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-lg p-6 space-y-5 border border-white/10 shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Megaphone size={20} className="text-[hsl(var(--accent-primary))]" />
                                {editingId ? 'Editar anuncio' : 'Nuevo anuncio'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Tipo */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider">Tipo</label>
                            <div className="grid grid-cols-5 gap-2">
                                {TYPE_OPTIONS.map(opt => {
                                    const Icon = opt.icon;
                                    const active = form.type === opt.value;
                                    return (
                                        <button key={opt.value} onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                                            className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-lg border text-[11px] font-medium transition-all ${active ? `border-white/30 bg-white/12 ${opt.color}` : 'border-white/8 bg-white/4 text-[hsl(var(--text-secondary))] hover:bg-white/8'}`}>
                                            <Icon size={18} className={active ? opt.color : ''} />
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Título */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider">
                                Título <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: 10% OFF pagando con transferencia"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))]/60 transition-colors placeholder:text-white/20"
                            />
                        </div>

                        {/* Subtítulo */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider">
                                Subtítulo <span className="text-white/25 font-normal">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Válido hasta el 30 de abril"
                                value={form.subtitle}
                                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))]/60 transition-colors placeholder:text-white/20"
                            />
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Inicio', key: 'startsAt' as const, hint: 'opcional' },
                                { label: 'Vencimiento', key: 'expiresAt' as const, hint: 'opcional' },
                            ].map(({ label, key, hint }) => (
                                <div key={key} className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider">
                                        {label} <span className="text-white/25 font-normal">({hint})</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={form[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))]/60 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Orden + Toggle activo */}
                        <div className="flex items-end gap-4">
                            <div className="space-y-1.5 flex-1">
                                <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider">Orden</label>
                                <input
                                    type="number" min={0} value={form.order}
                                    onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))]/60 transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-2 pb-1">
                                <span className="text-sm text-[hsl(var(--text-secondary))]">Activo</span>
                                <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                                    {form.active
                                        ? <ToggleRight size={30} className="text-emerald-400" />
                                        : <ToggleLeft size={30} className="text-white/25" />}
                                </button>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-1">
                            <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-[hsl(var(--text-secondary))] hover:bg-white/5 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving || !form.title.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity">
                                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                                {saving ? 'Guardando…' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Tabla ─── */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={22} className="animate-spin text-[hsl(var(--accent-primary))]" />
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                        <Megaphone size={36} className="text-white/10" />
                        <p className="text-sm text-[hsl(var(--text-secondary))]">No hay anuncios todavía</p>
                        <button onClick={openCreate} className="text-sm text-[hsl(var(--accent-primary))] hover:underline">
                            Crear el primero →
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-white/10">
                                <tr className="text-xs text-[hsl(var(--text-secondary))]">
                                    <th className="text-left px-6 py-3 font-medium">Tipo</th>
                                    <th className="text-left px-6 py-3 font-medium">Mensaje</th>
                                    <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Vence</th>
                                    <th className="text-center px-4 py-3 font-medium">Estado</th>
                                    <th className="text-right px-6 py-3 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map(ann => (
                                    <tr key={ann.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${TYPE_BADGE[ann.type]}`}>
                                                <TypeIcon type={ann.type} />
                                                {TYPE_OPTIONS.find(o => o.value === ann.type)?.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="font-medium truncate">{ann.title}</p>
                                            {ann.subtitle && <p className="text-xs text-[hsl(var(--text-secondary))] truncate mt-0.5">{ann.subtitle}</p>}
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell text-xs text-[hsl(var(--text-secondary))]">
                                            {ann.expiresAt
                                                ? new Date(ann.expiresAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                : <span className="text-white/20">Sin vencimiento</span>}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button onClick={() => handleToggle(ann)} title={ann.active ? 'Desactivar' : 'Activar'}>
                                                {ann.active
                                                    ? <ToggleRight size={26} className="text-emerald-400 hover:text-emerald-300 transition-colors" />
                                                    : <ToggleLeft size={26} className="text-white/25 hover:text-white/50 transition-colors" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(ann)}
                                                    className="p-1.5 rounded-lg text-[hsl(var(--text-secondary))] hover:text-white hover:bg-white/10 transition-colors" title="Editar">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(ann.id)} disabled={deletingId === ann.id}
                                                    className="p-1.5 rounded-lg text-[hsl(var(--text-secondary))] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40" title="Eliminar">
                                                    {deletingId === ann.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Leyenda tipos */}
            <div className="glass-card p-4">
                <p className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-3">Tipos disponibles</p>
                <div className="flex flex-wrap gap-2">
                    {TYPE_OPTIONS.map(opt => {
                        const Icon = opt.icon;
                        return (
                            <span key={opt.value} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${TYPE_BADGE[opt.value]}`}>
                                <Icon size={11} />
                                {opt.label}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

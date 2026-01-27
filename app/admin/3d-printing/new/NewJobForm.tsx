'use client';

import { useState, useTransition } from 'react';
import { upload3DModel } from '@/app/actions/printing-3d';
import { Loader2, Upload, FileBox } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewPrintingJobForm({ users }: { users: any[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedUser, setSelectedUser] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!file || !selectedUser) {
            setError('Por favor complete todos los campos requeridos');
            return;
        }

        const formData = new FormData(e.currentTarget);
        formData.set('userId', selectedUser);

        startTransition(async () => {
            const result = await upload3DModel(formData);
            if (result.success) {
                router.push('/admin/3d-printing');
                router.refresh();
            } else {
                setError(result.error || 'Error al crear el trabajo');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white/5 p-6 rounded-xl border border-white/10">
            {/* User Selection */}
            <div>
                <label className="block text-sm font-medium mb-2">Cliente *</label>
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[hsl(var(--accent-primary))]"
                    required
                >
                    <option value="">Seleccionar cliente...</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
            </div>

            {/* File Upload */}
            <div>
                <label className="block text-sm font-medium mb-2">Archivo 3D (.stl, .glb) *</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
                    <input
                        type="file"
                        name="file"
                        accept=".stl,.glb,.gltf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-upload"
                        required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        {file ? (
                            <>
                                <FileBox className="w-10 h-10 text-[hsl(var(--accent-primary))]" />
                                <span className="font-medium">{file.name}</span>
                                <span className="text-xs text-white/50">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-white/30" />
                                <span className="text-sm text-white/50">Click para seleccionar archivo</span>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium mb-2">Título del Trabajo *</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Ej: Pieza soporte monitor"
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[hsl(var(--accent-primary))]"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium mb-2">Descripción / Notas</label>
                <textarea
                    name="description"
                    rows={3}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[hsl(var(--accent-primary))]"
                />
            </div>

            {/* Price Estimate */}
            <div>
                <label className="block text-sm font-medium mb-2">Precio Estimado (USD)</label>
                <input
                    type="number"
                    name="price"
                    step="0.01"
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[hsl(var(--accent-primary))]"
                />
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Crear Trabajo
                </button>
            </div>
        </form>
    );
}

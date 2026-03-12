'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteAllCategories } from '@/app/actions/categories';

export function DeleteAllCategoriesButton() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleConfirm() {
        startTransition(async () => {
            await deleteAllCategories();
            setShowConfirm(false);
        });
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="btn btn-danger flex items-center gap-2"
                title="Eliminar todas las categorías"
            >
                <Trash2 size={18} />
                Eliminar todas
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-card p-6 max-w-sm w-full mx-4 space-y-4 border border-red-500/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                <Trash2 size={22} />
                            </div>
                            <h2 className="text-lg font-semibold">Eliminar todas las categorías</h2>
                        </div>
                        <p className="text-[color:var(--text-secondary)] text-sm">
                            ¿Estás seguro de que deseas eliminar <strong className="text-white">todas</strong> las categorías?
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3 justify-end pt-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="btn btn-danger flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Eliminando…
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Sí, eliminar todo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

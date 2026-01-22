'use client';

import { useState, useTransition } from 'react';
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { bulkUploadCategories } from '@/app/actions/categories-bulk';

export function BulkUploadCategoriesButton() {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('idle');
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        startTransition(async () => {
            try {
                const result = await bulkUploadCategories(formData);
                setStatus('success');
                setMessage(`✓ ${result.created} categorías creadas, ${result.skipped} omitidas`);
                // Auto-hide success message after 5s
                setTimeout(() => setStatus('idle'), 5000);
            } catch (error) {
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Error al subir el archivo');
            }
        });

        // Clear input
        e.target.value = '';
    };

    return (
        <div className="relative inline-block">
            <input
                type="file"
                id="bulk-upload-categories"
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                disabled={isPending}
            />

            <label
                htmlFor="bulk-upload-categories"
                className={`btn btn-outline flex items-center gap-2 cursor-pointer ${isPending ? 'opacity-50 pointer-events-none' : ''
                    } ${status === 'success' ? 'border-green-500 text-green-500' :
                        status === 'error' ? 'border-red-500 text-red-500' : ''
                    }`}
            >
                {isPending ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Procesando...
                    </>
                ) : status === 'success' ? (
                    <>
                        <CheckCircle2 size={20} />
                        ¡Listo!
                    </>
                ) : status === 'error' ? (
                    <>
                        <AlertCircle size={20} />
                        Error
                    </>
                ) : (
                    <>
                        <FileSpreadsheet size={20} />
                        Carga Masiva
                    </>
                )}
            </label>

            {message && status !== 'idle' && (
                <div className={`absolute top-full mt-2 right-0 w-64 p-3 rounded-lg text-xs font-medium backdrop-blur-md border animate-in fade-in slide-in-from-top-2 z-10 ${status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                        'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}

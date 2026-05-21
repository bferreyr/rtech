'use client';

import { useEffect } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

export default function ExtranetEmbed() {
    const extranetUrl = "https://www.gitextranet.com.ar/login?login=1&embedded=8335&user_name=RINCON&password=amircito";

    useEffect(() => {
        // Redirección a nivel principal (top-level) para evitar el bloqueo de cookies de terceros de Chrome/Safari
        window.location.href = extranetUrl;
    }, []);

    return (
        <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50/50">
            <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--accent-primary))] mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Conectando al Sistema Mayorista...</h2>
            <p className="text-gray-500 max-w-md text-center mb-8">
                Estamos estableciendo una conexión segura. Por favor espere mientras lo redirigimos al portal de compras.
            </p>
            <a 
                href={extranetUrl}
                className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--accent-primary))] text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(var(--accent-primary))]/20"
            >
                <span>Ingresar Manualmente</span>
                <ExternalLink size={18} />
            </a>
        </div>
    );
}

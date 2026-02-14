'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <SuccessContent />
        </Suspense>
    );
}

import { useSearchParams } from 'next/navigation';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-card p-8 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">¡Pago Exitoso!</h1>
                    <p className="text-[hsl(var(--text-secondary))]">
                        Tu orden ha sido procesada correctamente. Te enviaremos un email con los detalles.
                    </p>
                </div>

                {orderId && (
                    <div className="p-4 rounded-xl bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-color))]">
                        <p className="text-sm text-[hsl(var(--text-tertiary))] uppercase tracking-wider mb-1">Orden #</p>
                        <p className="font-mono text-xl">{orderId}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {orderId && (
                        <Link
                            href={`/orders/${orderId}`}
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Package className="w-4 h-4" />
                            Ver Detalles de la Orden
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="btn btn-ghost w-full flex items-center justify-center gap-2"
                    >
                        Volver a la Tienda
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

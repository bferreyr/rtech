'use client';

import { useState } from 'react';
import { createWarrantyRequest, WarrantyInput } from '@/app/actions/warranty';
import { CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function WarrantyPage() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    
    // Form state
    const [type, setType] = useState<'DOA' | 'WARRANTY'>('WARRANTY');
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [productSku, setProductSku] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [problemDescription, setProblemDescription] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');

    const [showSkuHelp, setShowSkuHelp] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const data: WarrantyInput = {
            contactName, contactEmail, contactPhone,
            type, productSku, serialNumber, problemDescription,
            invoiceDate: type === 'DOA' && invoiceDate ? new Date(invoiceDate) : null,
        };

        const res = await createWarrantyRequest(data);
        if (res.success) {
            setSubmitted(true);
        } else {
            setError(res.error || 'Ocurrió un error inesperado al enviar el formulario.');
        }
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
                <div className="bg-[hsl(var(--bg-secondary))] p-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center">
                    <CheckCircle2 className="text-green-500 w-16 h-16 mb-6" />
                    <h1 className="text-3xl font-black mb-4 gradient-text">¡Solicitud Registrada!</h1>
                    <p className="text-[hsl(var(--text-secondary))] mb-8 leading-relaxed">
                        Hemos recibido tu solicitud de {type === 'DOA' ? 'DOA' : 'Garantía'}. Nos contactaremos a la brevedad a tu correo electrónico ({contactEmail}) o teléfono ({contactPhone}) con los pasos a seguir.
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent-secondary))] transition-colors rounded-xl font-bold flex items-center gap-2"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-black mb-4 gradient-text">Gestión de Garantías y RMA</h1>
                <p className="text-[hsl(var(--text-secondary))] text-lg">
                    Completa el siguiente formulario para procesar tu solicitud de garantía o reemplazo por defecto de fábrica (DOA).
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[hsl(var(--bg-secondary))] p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl space-y-8">
                
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium">
                        {error}
                    </div>
                )}

                {/* Tipo de Solicitud */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-2">Tipo de Solicitud</h2>
                    <div className="flex gap-4">
                        <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${type === 'WARRANTY' ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10' : 'border-white/10 hover:border-white/20'}`}>
                            <input type="radio" value="WARRANTY" checked={type === 'WARRANTY'} onChange={() => setType('WARRANTY')} className="hidden" />
                            <div className="font-bold text-center">Garantía Estándar</div>
                        </label>
                        <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${type === 'DOA' ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10' : 'border-white/10 hover:border-white/20'}`}>
                            <input type="radio" value="DOA" checked={type === 'DOA'} onChange={() => setType('DOA')} className="hidden" />
                            <div className="font-bold text-center">DOA (Falla por defecto de caja)</div>
                        </label>
                    </div>
                </div>

                {/* Datos de Contacto */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-2">Datos de Contacto</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Nombre y Apellido *</label>
                            <input required type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full bg-[hsl(var(--bg-primary))] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[hsl(var(--accent-primary))]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Teléfono *</label>
                            <input required type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full bg-[hsl(var(--bg-primary))] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[hsl(var(--accent-primary))]" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Email *</label>
                            <input required type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full bg-[hsl(var(--bg-primary))] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[hsl(var(--accent-primary))]" />
                        </div>
                    </div>
                </div>

                {/* Información del Producto */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-2">Información del Producto</h2>
                    
                    <div className="space-y-4">
                        <div className="space-y-1 relative">
                            <label className="text-sm font-medium text-[hsl(var(--text-secondary))] flex items-center gap-2">
                                Artículo / SKU *
                                <button type="button" onClick={() => setShowSkuHelp(!showSkuHelp)} className="text-[hsl(var(--accent-primary))] hover:text-white transition-colors" title="¿Cómo encontrar el SKU?">
                                    <HelpCircle size={16} />
                                </button>
                            </label>
                            {showSkuHelp && (
                                <div className="absolute z-10 bottom-full left-0 mb-2 p-3 bg-black border border-white/20 rounded-lg shadow-xl text-sm max-w-sm">
                                    <strong>¿Cómo encontrar el SKU?</strong>
                                    <p className="mt-1 text-[hsl(var(--text-secondary))]">El SKU es el código del producto que aparece en su factura. También se puede ver al entrar en un pedido, debajo del nombre del producto se encuentra el SKU. Generalmente es un código alfanumérico que identifica el artículo adquirido.</p>
                                </div>
                            )}
                            <input required type="text" value={productSku} onChange={(e) => setProductSku(e.target.value)} className="w-full bg-[hsl(var(--bg-primary))] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[hsl(var(--accent-primary))]" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Número de Serie *</label>
                            <input required type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="w-full bg-[hsl(var(--bg-primary))] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[hsl(var(--accent-primary))]" />
                        </div>

                        {type === 'DOA' && (
                            <div className="space-y-1 md:w-1/2">
                                <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Fecha de Factura *</label>
                                <input required type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full bg-[hsl(var(--bg-primary))] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[hsl(var(--accent-primary))]" />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[hsl(var(--text-secondary))]">Descripción del Problema *</label>
                            <textarea required rows={4} value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} className="w-full bg-[hsl(var(--bg-primary))] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[hsl(var(--accent-primary))] resize-none" placeholder="Por favor describa el problema detalladamente..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full py-4 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] rounded-xl font-black text-lg hover:shadow-lg hover:shadow-[hsl(var(--accent-primary))]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <><Loader2 className="animate-spin" size={24} /> Procesando...</>
                        ) : (
                            'Enviar Solicitud'
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}

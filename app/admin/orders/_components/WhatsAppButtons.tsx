'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonsProps {
    phone: string;
    customerName: string;
    orderId: string;
}

function cleanPhone(raw: string): string {
    // Removes all non-numeric characters
    let digits = raw.replace(/[^0-9]/g, '');
    // If Argentine number starts with 0, strip it
    if (digits.startsWith('0')) digits = digits.slice(1);
    // If it doesn't start with country code, prepend Argentina's +54
    if (!digits.startsWith('54')) digits = '54' + digits;
    return digits;
}

function buildWaUrl(phone: string, text: string): string {
    const cleaned = cleanPhone(phone);
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

export function WhatsAppButtons({ phone, customerName, orderId }: WhatsAppButtonsProps) {
    // Short order ID for display (last 8 chars)  
    const shortId = orderId.slice(-8).toUpperCase();
    const firstName = customerName.split(' ')[0];

    const messages = [
        {
            id: 'paid',
            label: 'Pago recibido ✅',
            color: 'bg-green-600 hover:bg-green-500 border-green-500/40',
            text:
                `¡Hola ${firstName}! 👋\n` +
                `Confirmamos que recibimos tu pago para el pedido *N° ${shortId}*. ✅\n` +
                `Estamos preparando tu envío y te avisaremos cuando esté en camino. ¡Gracias por tu compra! 🛒`,
        },
        {
            id: 'shipped',
            label: 'Pedido en camino 📦',
            color: 'bg-blue-600 hover:bg-blue-500 border-blue-500/40',
            text:
                `¡Hola ${firstName}! 📦\n` +
                `Tu pedido *N° ${shortId}* ya está en camino. 🚀\n` +
                `En breve recibirás más información sobre el seguimiento. ¡Que lo disfrutes!`,
        },
        {
            id: 'pickup',
            label: 'Listo para retirar 🏪',
            color: 'bg-purple-600 hover:bg-purple-500 border-purple-500/40',
            text:
                `¡Hola ${firstName}! 🏪\n` +
                `Tu pedido *N° ${shortId}* ya está listo para ser retirado en nuestra tienda. ✅\n` +
                `Podés pasar cuando quieras en nuestro horario de atención. ¡Te esperamos!`,
        },
    ];

    return (
        <div className="space-y-2">
            <p className="text-xs text-[hsl(var(--text-secondary))] mb-3 flex items-center gap-1.5">
                <MessageCircle size={12} className="text-green-400" />
                Notificaciones por WhatsApp
            </p>
            {messages.map((msg) => (
                <a
                    key={msg.id}
                    href={buildWaUrl(phone, msg.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border text-white text-xs font-semibold transition-colors ${msg.color}`}
                >
                    <MessageCircle size={13} />
                    {msg.label}
                </a>
            ))}
            <p className="text-[10px] text-[hsl(var(--text-tertiary))] mt-1 leading-relaxed">
                Abre WhatsApp con el mensaje listo para enviar. Solo hacé click en &quot;Enviar&quot;.
            </p>
        </div>
    );
}

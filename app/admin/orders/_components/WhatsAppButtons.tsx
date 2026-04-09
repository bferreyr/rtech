'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonsProps {
    phone: string;
    customerName: string;
    orderId: string;
    orderTotal?: number;
    paymentMethod?: string | null;
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

export function WhatsAppButtons({ phone, customerName, orderId, orderTotal, paymentMethod }: WhatsAppButtonsProps) {
    // Short order ID for display (last 8 chars)
    const shortId = orderId.slice(-8).toUpperCase();
    const firstName = customerName.split(' ')[0];

    // Build payment method hint for the incentive message
    const paymentHint = paymentMethod === 'transferencia'
        ? `Si preferis pagar por *transferencia bancaria*, te paso el alias: *bartu.ferreyra* (Santander). Ademas tenes un *10% de descuento* pagando por este medio! 🎁`
        : paymentMethod === 'mercadopago'
        ? `Podes completar el pago facilmente con *Mercado Pago* con tarjeta, dinero en cuenta o cuotas sin interes.`
        : `Podes pagar por *transferencia bancaria* (con 10% OFF) o por *Mercado Pago*. El que mas te convenga!`;

    const totalText = orderTotal ? ` por un total de *USD ${orderTotal.toFixed(2)}*` : '';

    const messages = [
        {
            id: 'payment_incentive',
            label: 'Incentivar pago 💳',
            color: 'bg-amber-600 hover:bg-amber-500 border-amber-500/40',
            text:
                `Hola ${firstName}! 👋\n\n` +
                `Te escribo desde *Rincon TECH* porque notamos que tu pedido *N° ${shortId}*${totalText} aun no fue abonado.\n\n` +
                `Queria consultar si tenes alguna duda sobre los productos, el envio o el proceso de pago, estoy disponible para ayudarte en lo que necesites! 😊\n\n` +
                `${paymentHint}\n\n` +
                `Si ya realizaste el pago y no lo registramos, avisame y lo verificamos enseguida. De lo contrario, cuando quieras te ayudo a finalizar la compra.\n\n` +
                `*Muchas gracias y quedamos a tu disposicion!* 🙌`,
        },
        {
            id: 'paid',
            label: 'Pago recibido ✅',
            color: 'bg-green-600 hover:bg-green-500 border-green-500/40',
            text:
                `Hola ${firstName}!\n` +
                `Confirmamos que recibimos tu pago para el pedido *N° ${shortId}*.\n` +
                `Estamos preparando tu envio y te avisaremos cuando este en camino. Gracias por tu compra!`,
        },
        {
            id: 'shipped',
            label: 'Pedido en camino 📦',
            color: 'bg-blue-600 hover:bg-blue-500 border-blue-500/40',
            text:
                `Hola ${firstName}!\n` +
                `Tu pedido *N° ${shortId}* ya esta en camino.\n` +
                `En breve recibiras mas informacion sobre el seguimiento. Que lo disfrutes!`,
        },
        {
            id: 'pickup',
            label: 'Listo para retirar 🏪',
            color: 'bg-purple-600 hover:bg-purple-500 border-purple-500/40',
            text:
                `Hola ${firstName}!\n` +
                `Tu pedido *N° ${shortId}* ya esta listo para ser retirado en nuestra tienda.\n` +
                `Podes pasar cuando quieras en nuestro horario de atencion. Te esperamos!`,
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

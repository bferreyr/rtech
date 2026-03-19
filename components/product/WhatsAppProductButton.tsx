'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WhatsAppProductButtonProps {
    productName: string;
    sku: string;
    fullWidth?: boolean;
}

export function WhatsAppProductButton({ productName, sku, fullWidth }: WhatsAppProductButtonProps) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        // Safe to use window on client side
        setUrl(window.location.href);
    }, []);

    const phoneNumber = '5493425933763';
    const message = `Hola RTECH! Quisiera consultar sobre este producto:\n*${productName}*\nSKU: ${sku}\nEnlace: ${url}`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm group ${fullWidth ? 'w-full' : ''}`}
        >
            <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <span>Consultar por WhatsApp</span>
        </a>
    );
}

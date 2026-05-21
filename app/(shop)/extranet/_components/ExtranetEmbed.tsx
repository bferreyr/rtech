'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function ExtranetEmbed() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && typeof window !== 'undefined' && (window as any).Extranet) {
            new (window as any).Extranet(8335, { username: 'RINCON', password: 'amircito' });
            initialized.current = true;
        }
    }, []);

    return (
        <>
            <Script 
                src="https://www.gitextranet.com.ar/static/javascript/embed.js" 
                strategy="afterInteractive"
                onLoad={() => {
                    if (!initialized.current && typeof window !== 'undefined' && (window as any).Extranet) {
                        new (window as any).Extranet(8335, { username: 'RINCON', password: 'amircito' });
                        initialized.current = true;
                    }
                }}
            />
            <div id="extranet_container" className="w-full min-h-[80vh]"></div>
        </>
    );
}

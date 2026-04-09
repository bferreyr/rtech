'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Tag, Sparkles, Flame, Info, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

type AnnouncementType = 'DISCOUNT' | 'NEW' | 'OFFER' | 'INFO' | 'URGENT';

interface Announcement {
    id: string;
    title: string;
    subtitle: string | null;
    type: AnnouncementType;
}

const TYPE_CONFIG: Record<AnnouncementType, {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    bg: string;
    text: string;
    border: string;
    badge: string;
    label: string;
}> = {
    DISCOUNT: {
        icon: Tag,
        bg: 'from-orange-600/90 via-red-600/90 to-orange-600/90',
        text: 'text-orange-50',
        border: 'border-orange-500/40',
        badge: 'bg-orange-400/25 text-orange-100',
        label: 'DESCUENTO',
    },
    NEW: {
        icon: Sparkles,
        bg: 'from-emerald-600/90 via-teal-600/90 to-emerald-600/90',
        text: 'text-emerald-50',
        border: 'border-emerald-500/40',
        badge: 'bg-emerald-400/25 text-emerald-100',
        label: 'NUEVO',
    },
    OFFER: {
        icon: Flame,
        bg: 'from-yellow-500/90 via-amber-500/90 to-yellow-500/90',
        text: 'text-yellow-950',
        border: 'border-yellow-400/40',
        badge: 'bg-yellow-300/30 text-yellow-900',
        label: 'OFERTA',
    },
    INFO: {
        icon: Info,
        bg: 'from-blue-600/90 via-indigo-600/90 to-blue-600/90',
        text: 'text-blue-50',
        border: 'border-blue-500/40',
        badge: 'bg-blue-400/25 text-blue-100',
        label: 'INFO',
    },
    URGENT: {
        icon: Zap,
        bg: 'from-red-600/90 via-rose-600/90 to-red-600/90',
        text: 'text-red-50',
        border: 'border-red-500/40',
        badge: 'bg-red-400/25 text-red-100',
        label: '¡URGENTE!',
    },
};

const STORAGE_KEY = 'rtech_announcements_dismissed';

export function AnnouncementBar() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [current, setCurrent] = useState(0);
    const [dismissed, setDismissed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
            setDismissed(true);
            return;
        }
        fetch('/api/announcements')
            .then(r => r.json())
            .then((data: Announcement[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    setAnnouncements(data);
                    setTimeout(() => setIsVisible(true), 80);
                }
            })
            .catch(() => {});
    }, []);

    const goTo = useCallback((index: number) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrent(index);
            setIsTransitioning(false);
        }, 180);
    }, []);

    const goNext = useCallback(() => {
        goTo((current + 1) % announcements.length);
    }, [current, announcements.length, goTo]);

    const goPrev = useCallback(() => {
        goTo((current - 1 + announcements.length) % announcements.length);
    }, [current, announcements.length, goTo]);

    // Rotación automática
    useEffect(() => {
        if (announcements.length <= 1) return;
        const interval = setInterval(goNext, 4500);
        return () => clearInterval(interval);
    }, [announcements.length, goNext]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            setDismissed(true);
            sessionStorage.setItem(STORAGE_KEY, 'true');
        }, 300);
    };

    if (dismissed || announcements.length === 0) return null;

    const ann = announcements[current];
    const config = TYPE_CONFIG[ann.type];
    const Icon = config.icon;

    return (
        <>
            {/* Spacer — mobile puede ser más alto si el texto hace wrap */}
            <div className={`w-full transition-all duration-300 ${isVisible ? 'h-10 sm:h-10' : 'h-0'}`} aria-hidden="true" />

            {/* The fixed bar, below the fixed navbar (top-16 = 64px) */}
            <div
                className={`fixed left-0 right-0 z-40 bg-gradient-to-r ${config.bg} border-b ${config.border} backdrop-blur-sm shadow-md transition-all duration-300 ease-in-out ${isVisible ? 'top-16 opacity-100' : '-top-20 opacity-0'}`}
                role="banner"
                aria-label="Anuncio"
            >
                {/* shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.04] to-white/0 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-2">

                    {/* Badge tipo — solo desktop */}
                    <span className={`hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider shrink-0 ${config.badge}`}>
                        <Icon size={10} />
                        {config.label}
                    </span>

                    {/* Prev — solo desktop */}
                    {announcements.length > 1 && (
                        <button onClick={goPrev} className={`hidden sm:flex shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors ${config.text} opacity-70 hover:opacity-100`} aria-label="Anterior">
                            <ChevronLeft size={15} />
                        </button>
                    )}

                    {/* Content — ocupa todo el ancho disponible, texto puede wrappear */}
                    <div className={`flex-1 transition-all duration-200 ${isTransitioning ? 'opacity-0 translate-y-0.5' : 'opacity-100 translate-y-0'}`}>
                        <p className={`text-sm font-semibold leading-snug text-center sm:text-left ${config.text}`}>
                            {ann.title}
                            {ann.subtitle && (
                                <span className={`hidden sm:inline opacity-75 font-normal text-xs ml-2`}>· {ann.subtitle}</span>
                            )}
                        </p>
                        {/* Subtítulo en mobile: segunda línea si existe */}
                        {ann.subtitle && (
                            <p className={`sm:hidden text-xs text-center opacity-75 leading-tight mt-0.5 ${config.text}`}>
                                {ann.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Next + Dots — solo desktop */}
                    {announcements.length > 1 && (
                        <>
                            <div className="hidden sm:flex items-center gap-1">
                                {announcements.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className={`rounded-full transition-all duration-200 ${config.text} ${i === current ? 'w-3 h-1.5 opacity-100' : 'w-1.5 h-1.5 opacity-35 hover:opacity-60'} bg-current`}
                                        aria-label={`Ir al anuncio ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <button onClick={goNext} className={`hidden sm:flex p-1 rounded-full hover:bg-black/10 transition-colors ${config.text} opacity-70 hover:opacity-100`} aria-label="Siguiente">
                                <ChevronRight size={15} />
                            </button>
                        </>
                    )}

                    {/* Close — siempre visible pero compacto en mobile */}
                    <button onClick={handleDismiss} className={`shrink-0 p-1 rounded-full hover:bg-black/15 transition-colors ${config.text} opacity-55 hover:opacity-90`} aria-label="Cerrar">
                        <X size={14} />
                    </button>
                </div>
            </div>
        </>
    );
}

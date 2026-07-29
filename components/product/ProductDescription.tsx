import { 
    Info, 
    Wifi, 
    Palette, 
    Mouse, 
    Maximize, 
    Battery, 
    Monitor, 
    Cpu, 
    HardDrive, 
    MemoryStick,
    Settings
} from 'lucide-react';

interface Props {
    description: string;
}

export function ProductDescription({ description }: Props) {
    if (!description) return null;

    let parsedAttributes: { atributo: string, valor: string }[] | null = null;

    try {
        const parsed = JSON.parse(description);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].atributo) {
            parsedAttributes = parsed;
        }
    } catch (e) {
        // Not a JSON string, fallback to normal text
    }

    if (parsedAttributes) {
        const getStyle = (attr: string) => {
            const lower = attr.toLowerCase();
            if (lower.includes('conectividad') || lower.includes('wireless') || lower.includes('wifi') || lower.includes('bluetooth') || lower.includes('red')) {
                return {
                    icon: <Wifi size={18} />,
                    color: 'text-blue-400',
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20 hover:border-blue-400/50',
                    shadow: 'hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]'
                };
            }
            if (lower.includes('resolución') || lower.includes('resolucion') || lower.includes('pantalla') || lower.includes('monitor') || lower.includes('video')) {
                return {
                    icon: <Monitor size={18} />,
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/20 hover:border-amber-400/50',
                    shadow: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                };
            }
            if (lower.includes('batería') || lower.includes('energia') || lower.includes('fuente') || lower.includes('consumo')) {
                return {
                    icon: <Battery size={18} />,
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20 hover:border-emerald-400/50',
                    shadow: 'hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                };
            }
            if (lower.includes('procesador') || lower.includes('cpu') || lower.includes('nucleos') || lower.includes('frecuencia')) {
                return {
                    icon: <Cpu size={18} />,
                    color: 'text-purple-400',
                    bg: 'bg-purple-500/10',
                    border: 'border-purple-500/20 hover:border-purple-400/50',
                    shadow: 'hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]'
                };
            }
            if (lower.includes('disco') || lower.includes('almacenamiento') || lower.includes('ssd') || lower.includes('hdd') || lower.includes('capacidad')) {
                return {
                    icon: <HardDrive size={18} />,
                    color: 'text-cyan-400',
                    bg: 'bg-cyan-500/10',
                    border: 'border-cyan-500/20 hover:border-cyan-400/50',
                    shadow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                };
            }
            if (lower.includes('ram') || lower.includes('memoria')) {
                return {
                    icon: <MemoryStick size={18} />,
                    color: 'text-indigo-400',
                    bg: 'bg-indigo-500/10',
                    border: 'border-indigo-500/20 hover:border-indigo-400/50',
                    shadow: 'hover:shadow-[0_0_20px_rgba(129,140,248,0.15)]'
                };
            }
            if (lower.includes('sensor') || lower.includes('boton') || lower.includes('botones') || lower.includes('switch') || lower.includes('teclado') || lower.includes('mouse')) {
                return {
                    icon: <Mouse size={18} />,
                    color: 'text-rose-400',
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/20 hover:border-rose-400/50',
                    shadow: 'hover:shadow-[0_0_20px_rgba(251,113,133,0.15)]'
                };
            }
            if (lower.includes('color') || lower.includes('rgb') || lower.includes('iluminacion')) {
                return {
                    icon: <Palette size={18} />,
                    color: 'text-pink-400',
                    bg: 'bg-pink-500/10',
                    border: 'border-pink-500/20 hover:border-pink-400/50',
                    shadow: 'hover:shadow-[0_0_20px_rgba(244,114,182,0.15)]'
                };
            }
            
            return {
                icon: <Settings size={18} />,
                color: 'text-slate-400',
                bg: 'bg-slate-500/10',
                border: 'border-slate-500/20 hover:border-slate-400/50',
                shadow: 'hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]'
            };
        };

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {parsedAttributes.map((attr, idx) => {
                    const style = getStyle(attr.atributo);
                    return (
                        <div 
                            key={idx} 
                            className={`
                                group flex items-start gap-4 p-4 rounded-xl border bg-[#0a0a0a]/50 backdrop-blur-sm
                                transition-all duration-300 ease-out hover:-translate-y-1
                                animate-in fade-in slide-in-from-bottom-4 fill-mode-both
                                ${style.border} ${style.shadow}
                            `}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className={`
                                flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg 
                                transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                                ${style.bg} ${style.color}
                            `}>
                                {style.icon}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-[11px] font-bold text-[color:var(--text-tertiary)] uppercase tracking-wider mb-1 truncate group-hover:text-[color:var(--text-secondary)] transition-colors">
                                    {attr.atributo}
                                </p>
                                <p className="text-sm font-medium text-[color:var(--text-primary)] leading-snug">
                                    {attr.valor}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Fallback: normal text description
    return (
        <div className="prose prose-invert max-w-none text-[color:var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {description}
        </div>
    );
}

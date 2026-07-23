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
        const getIcon = (attr: string) => {
            const lower = attr.toLowerCase();
            if (lower.includes('conectividad') || lower.includes('wireless') || lower.includes('wifi')) return <Wifi size={18} />;
            if (lower.includes('color')) return <Palette size={18} />;
            if (lower.includes('sensor') || lower.includes('boton') || lower.includes('botones')) return <Mouse size={18} />;
            if (lower.includes('resolución') || lower.includes('resolucion')) return <Maximize size={18} />;
            if (lower.includes('batería') || lower.includes('energia')) return <Battery size={18} />;
            if (lower.includes('pantalla') || lower.includes('monitor')) return <Monitor size={18} />;
            if (lower.includes('procesador') || lower.includes('cpu')) return <Cpu size={18} />;
            if (lower.includes('disco') || lower.includes('almacenamiento')) return <HardDrive size={18} />;
            if (lower.includes('ram') || lower.includes('memoria')) return <MemoryStick size={18} />;
            return <Settings size={18} />;
        };

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {parsedAttributes.map((attr, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] hover:border-[color:var(--accent-primary)] transition-colors">
                        <div className="text-[color:var(--accent-primary)] mt-0.5">
                            {getIcon(attr.atributo)}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-[color:var(--text-tertiary)] uppercase tracking-wider mb-1">
                                {attr.atributo}
                            </p>
                            <p className="text-sm font-medium text-[color:var(--text-primary)]">
                                {attr.valor}
                            </p>
                        </div>
                    </div>
                ))}
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

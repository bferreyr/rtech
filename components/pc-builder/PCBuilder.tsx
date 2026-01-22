'use client';

import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { Check, Plus, ShoppingCart, Trash2, Monitor, Cpu, HardDrive, Zap, Layout, Box, MinusCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string | null;
    categoryId: string | null;
}

interface PCBuilderProps {
    categories: {
        id: string;
        name: string;
        slug: string;
        products: Product[];
    }[];
}

const STEPS = [
    { slug: 'procesadores', label: 'Procesador', icon: Cpu },
    { slug: 'motherboards', label: 'Motherboard', icon: Layout },
    { slug: 'memorias', label: 'Memoria RAM', icon: Box },
    { slug: 'placas-de-video', label: 'Placa de Video', icon: Monitor },
    { slug: 'almacenamiento', label: 'Almacenamiento', icon: HardDrive },
    { slug: 'fuentes', label: 'Fuente de Poder', icon: Zap },
    { slug: 'gabinetes', label: 'Gabinete', icon: Monitor },
];

// Compatibility Helpers
const SPECS_DB = {
    sockets: {
        '1851': ['1851', 'lga1851', 'z890', 'b860', 'h810'],
        '1700': ['1700', 'lga1700', 'z790', 'z690', 'b760', 'b660', 'h610'],
        '1200': ['1200', 'lga1200', 'z590', 'z490', 'b560', 'b460', 'h510', 'h410'],
        'am5': ['am5', 'x870', 'x670', 'b850', 'b840', 'b650', 'a620', '9950x', '9900x', '9700x', '9600x', '8700f', '8700g', '8600g', '8500g', '7950x', '7900x', '7700x', '7600x', 'ryzen 9000', 'ryzen 8000', 'ryzen 7000'],
        'am4': ['am4', 'x570', 'b550', 'a520', 'b450', 'x470', 'a320', 'ryzen 5000', 'ryzen 5 5', 'ryzen 7 5', 'ryzen 9 5', '5800x', '5600x', '5700x', '5900x', '5950x', '4100', '4500', '4600g', '5500', '5600g', '5700g', '3200g', '3000g']
    },
    brands: {
        'intel': ['intel', 'core', 'pentium', 'celeron', 'i3', 'i5', 'i7', 'i9', '1851'],
        'amd': ['amd', 'ryzen', 'athlon', 'threadripper']
    },
    memory: {
        'ddr5': ['ddr5', 'd5'],
        'ddr4': ['ddr4', 'd4', '3200mhz', '3000mhz', '2666mhz', '2400mhz'], // High speeds usually DDR4 or DDR5, low generic checking
        'ddr3': ['ddr3', 'd3']
    }
};

const getProductSpecs = (name: string) => {
    const n = name.toLowerCase();

    // Detect Brand
    let brand = null;
    if (SPECS_DB.brands.intel.some(k => n.includes(k))) brand = 'intel';
    else if (SPECS_DB.brands.amd.some(k => n.includes(k))) brand = 'amd';

    // Detect Socket
    let socket = null;
    for (const [s, keywords] of Object.entries(SPECS_DB.sockets)) {
        if (keywords.some(k => n.includes(k))) {
            socket = s;
            break;
        }
    }
    // Infer brand from socket if missing
    if (!brand && socket) {
        if (['1851', '1700', '1200'].includes(socket)) brand = 'intel';
        if (['am5', 'am4'].includes(socket)) brand = 'amd';
    }

    // Detect Memory
    let memory = null;
    if (n.includes('ddr5')) memory = 'ddr5';
    else if (n.includes('ddr4') || n.includes(' d4 ')) memory = 'ddr4';
    else if (n.includes('ddr3')) memory = 'ddr3';

    // Infer memory from socket/chipset if missing (approximate rules)
    if (!memory) {
        if (socket === '1851') memory = 'ddr5';
        if (socket === 'am5') memory = 'ddr5';
        if (socket === 'am4' || socket === '1200') memory = 'ddr4'; // Mostly DDR4
    }

    return { brand, socket, memory };
};

export function PCBuilder({ categories }: PCBuilderProps) {
    const [selected, setSelected] = useState<Record<string, Product | null>>({});
    const [currentStep, setCurrentStep] = useState(0);
    const { formatUSD, toARS, formatARS } = useCurrency();
    const { addItem } = useCart();
    const router = useRouter();

    const currentStepConfig = STEPS[currentStep];
    const currentCategory = categories.find(c => c.slug === currentStepConfig.slug);

    const totalPrice = Object.values(selected).reduce((acc, p) => acc + (p?.price || 0), 0);

    // Flexible Purchase Logic: Min 3 components
    const selectedCount = Object.values(selected).filter(Boolean).length;
    const isComplete = selectedCount >= 3;

    const handleSelect = (product: Product) => {
        setSelected(prev => ({ ...prev, [currentStepConfig.slug]: product }));
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleRemove = (slug: string) => {
        setSelected(prev => ({ ...prev, [slug]: null }));
    };

    const handleAddToCart = () => {
        Object.values(selected).forEach(product => {
            if (product) {
                // @ts-ignore
                addItem(product);
            }
        });
        router.push('/checkout');
    };

    // Filter Logic
    const filteredProducts = currentCategory?.products.filter(p => {
        if (!p) return false;
        const specs = getProductSpecs(p.name);

        // 1. Motherboard Filter (depends on CPU)
        if (currentStepConfig.slug === 'motherboards') {
            const cpu = selected['procesadores'];
            if (cpu) {
                const cpuSpecs = getProductSpecs(cpu.name);

                // Strict Brand Check: If CPU is Intel, ONLY show Intel. Hide incompatible or unknown.
                if (cpuSpecs.brand === 'intel' && specs.brand !== 'intel') return false;
                if (cpuSpecs.brand === 'amd' && specs.brand !== 'amd') return false;

                // Socket Check
                if (cpuSpecs.socket && specs.socket && cpuSpecs.socket !== specs.socket) return false;
            }

            // RAM Back-check (if RAM selected first somehow or re-selecting mobo)
            const ram = selected['memorias'];
            if (ram) {
                const ramSpecs = getProductSpecs(ram.name);
                if (ramSpecs.memory && specs.memory && ramSpecs.memory !== specs.memory) return false;
            }
        }

        // 2. CPU Filter (depends on Motherboard)
        if (currentStepConfig.slug === 'procesadores') {
            const mobo = selected['motherboards'];
            if (mobo) {
                const moboSpecs = getProductSpecs(mobo.name);

                if (moboSpecs.brand === 'intel' && specs.brand !== 'intel') return false;
                if (moboSpecs.brand === 'amd' && specs.brand !== 'amd') return false;
                if (moboSpecs.socket && specs.socket && moboSpecs.socket !== specs.socket) return false;
            }
        }

        // 3. RAM Filter (depends on Motherboard > CPU)
        if (currentStepConfig.slug === 'memorias') {
            const mobo = selected['motherboards'];
            if (mobo) {
                const moboSpecs = getProductSpecs(mobo.name);
                if (moboSpecs.memory && specs.memory && moboSpecs.memory !== specs.memory) return false;
            } else {
                // Fallback to CPU hint if mobo missing (less reliable)
                const cpu = selected['procesadores'];
                if (cpu) {
                    const cpuSpecs = getProductSpecs(cpu.name);
                    // AM5 requires DDR5, AM4 requires DDR4
                    if (cpuSpecs.socket === 'am5' && specs.memory && specs.memory !== 'ddr5') return false;
                    if (cpuSpecs.socket === 'am4' && specs.memory && specs.memory !== 'ddr4') return false;
                }
            }
        }

        return true;
    }) || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4">
            {/* Left: Component Selection */}
            <div className="lg:col-span-8 space-y-8">
                {/* Steps Bar */}
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 border-b border-white/5">
                    {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isSelected = !!selected[step.slug];
                        const isActive = currentStep === idx;

                        return (
                            <button
                                key={step.slug}
                                onClick={() => setCurrentStep(idx)}
                                className={`flex flex-col items-center min-w-[100px] gap-2 p-3 rounded-xl transition-all ${isActive ? 'bg-[hsl(var(--accent-primary))]/20 border border-[hsl(var(--accent-primary))]/50' :
                                    isSelected ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${isActive ? 'text-[hsl(var(--accent-primary))]' : isSelected ? 'text-green-400' : 'text-[hsl(var(--text-tertiary))]'}`}>
                                    <Icon size={24} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{step.label}</span>
                                {isSelected && <Check size={12} className="text-green-400" />}
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            {currentStepConfig.label}
                            <span className="text-sm font-normal text-[hsl(var(--text-tertiary))] bg-white/5 px-3 py-1 rounded-full uppercase"> Paso {currentStep + 1} de {STEPS.length} </span>
                        </h2>
                        <span className="text-xs text-[hsl(var(--text-tertiary))]">
                            Mostrando {filteredProducts.length} productos compatibles
                        </span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredProducts.map((product) => {
                                const specs = getProductSpecs(product.name);
                                const isSelected = selected[currentStepConfig.slug]?.id === product.id;

                                return (
                                    <div
                                        key={product.id}
                                        className={`glass-card p-4 group cursor-pointer border-2 transition-all ${isSelected ? 'border-[hsl(var(--accent-primary))]' : 'border-transparent hover:border-white/20'
                                            }`}
                                        onClick={() => handleSelect(product)}
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/20 shrink-0">
                                                {product.imageUrl && (
                                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold text-sm leading-tight line-clamp-2">{product.name}</h3>
                                                    <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">SKU: {product.sku}</p>

                                                    {/* Compatibility Tags */}
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {specs.brand === 'intel' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Intel</span>}
                                                        {specs.brand === 'amd' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">AMD</span>}
                                                        {specs.socket && <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[hsl(var(--text-secondary))] border border-white/10 uppercase">{specs.socket}</span>}
                                                        {specs.memory && <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">{specs.memory}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[hsl(var(--accent-primary))] font-black text-lg">{formatUSD(product.price)}</span>
                                                        <span className="text-[10px] text-[hsl(var(--text-tertiary))] font-bold">{formatARS(product.price)}</span>
                                                    </div>
                                                    <button className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-[hsl(var(--accent-primary))] text-white' : 'bg-white/5 hover:bg-white/10'
                                                        }`}>
                                                        {isSelected ? <Check size={18} /> : <Plus size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                            <div className="p-3 rounded-full bg-orange-500/10 text-orange-400 mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No hay productos compatibles</h3>
                            <p className="text-[hsl(var(--text-secondary))] max-w-md mx-auto mb-6">
                                Las opciones disponibles no son compatibles con los componentes que seleccionaste previamente (ej. Socket o Memoria diferente).
                            </p>
                            <button
                                onClick={() => {
                                    // Reset previous steps relevant to incompatibility? 
                                    // For simplicity, just suggest removing filters (which means unselecting conflicting parts).
                                    // Or user can go back manually.
                                    setSelected({});
                                    setCurrentStep(0);
                                }}
                                className="btn btn-outline btn-sm"
                            >
                                Reiniciar Configuración
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                <div className="glass-card p-6 space-y-6">
                    <h3 className="text-xl font-bold border-b border-white/10 pb-4">Tu Configuración</h3>

                    <div className="space-y-4">
                        {STEPS.map((step) => {
                            const prod = selected[step.slug];
                            return (
                                <div key={step.slug} className="flex items-center justify-between text-sm group">
                                    <div className="flex items-center gap-3 shrink-0 mr-4">
                                        <div className={`p-1.5 rounded-md ${prod ? 'text-[hsl(var(--accent-primary))]' : 'text-[hsl(var(--text-tertiary))] opacity-50'}`}>
                                            <step.icon size={16} />
                                        </div>
                                        <span className={`font-medium ${!prod && 'opacity-50'}`}>{step.label}</span>
                                    </div>

                                    {prod ? (
                                        <div className="flex items-center gap-3 overflow-hidden text-right">
                                            <span className="font-bold truncate max-w-[120px] text-[hsl(var(--text-secondary))]">{prod.name}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRemove(step.slug); }}
                                                className="text-white/20 hover:text-red-400 transition-colors"
                                            >
                                                <MinusCircle size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[hsl(var(--text-tertiary))] italic">No seleccionado</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-[hsl(var(--text-secondary))] font-medium uppercase tracking-widest text-xs">Total Estimado</span>
                            <div className="text-right">
                                <p className="text-3xl font-black gradient-text">{formatUSD(totalPrice)}</p>
                                <p className="text-sm font-bold text-[hsl(var(--text-tertiary))]">{formatARS(totalPrice)}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isComplete}
                            className={`btn btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg transition-transform ${isComplete ? 'scale-100 hover:scale-[1.02]' : 'opacity-50 grayscale'}`}
                        >
                            <ShoppingCart size={24} />
                            {isComplete ? 'Agregar al Carrito' : `Selecciona al menos 3 componentes (${selectedCount}/3)`}
                        </button>
                        {!isComplete && (
                            <p className="text-[10px] text-center text-[hsl(var(--text-tertiary))] font-medium">
                                Mínimo 3 componentes para comprar
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

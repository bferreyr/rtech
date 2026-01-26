import { Printer, Box, Zap, Send, FileText, CheckCircle2, ArrowRight, Cpu, Layers } from 'lucide-react';
import Link from 'next/link';

export default function ThreeDPrintingPage() {
    return (
        <div className="min-h-screen bg-[hsl(var(--bg-primary))]">
            {/* Hero Section */}
            <div className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[hsl(var(--accent-primary))]/5">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--bg-primary))] via-transparent to-[hsl(var(--bg-primary))]"></div>
                </div>

                <div className="container relative mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent-primary))]/10 border border-[hsl(var(--accent-primary))]/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Printer size={14} className="text-[hsl(var(--accent-primary))]" />
                        <span className="text-xs font-bold text-[hsl(var(--accent-primary))] uppercase tracking-wider">Nuevo Servicio</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Tu Imaginación, <span className="gradient-text">Impresa en 3D</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[hsl(var(--text-secondary))] max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Materializamos tus ideas con tecnología de impresión FDM y Resina de alta precisión.
                        Prototipado rápido, repuestos y figuras de colección.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link
                            href="https://wa.me/5491112345678"
                            target="_blank"
                            className="btn btn-primary h-14 px-8 text-lg flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            <Send size={20} />
                            Pedir Presupuesto
                        </Link>
                        <Link
                            href="#como-funciona"
                            className="h-14 px-8 text-lg flex items-center gap-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all w-full sm:w-auto justify-center font-bold"
                        >
                            Ver Proceso
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Stats */}
            <div className="container mx-auto px-4 -mt-20 relative z-10 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 text-center hover:border-[hsl(var(--accent-primary))]/30 transition-colors">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                            <Cpu className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-black mb-1">0.05mm</h3>
                        <p className="text-[hsl(var(--text-secondary))] font-medium">Ultra Precisión</p>
                    </div>
                    <div className="glass-card p-8 text-center hover:border-[hsl(var(--accent-primary))]/30 transition-colors">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                            <Layers className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-3xl font-black mb-1">+10</h3>
                        <p className="text-[hsl(var(--text-secondary))] font-medium">Materiales Disponibles</p>
                    </div>
                    <div className="glass-card p-8 text-center hover:border-[hsl(var(--accent-primary))]/30 transition-colors">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-3xl font-black mb-1">24-48hs</h3>
                        <p className="text-[hsl(var(--text-secondary))] font-medium">Tiempo de Entrega Rápido</p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div id="como-funciona" className="py-24 border-t border-white/5 bg-[hsl(var(--bg-secondary))]/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">¿Cómo funciona?</h2>
                        <p className="text-[hsl(var(--text-secondary))]">Tu idea a la realidad en 4 simples pasos</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: FileText,
                                title: "1. Envía tu Archivo",
                                desc: "Envíanos tu archivo STL, OBJ o cuéntanos tu idea para que la diseñemos."
                            },
                            {
                                icon: Box,
                                title: "2. Recibí Presupuesto",
                                desc: "Analizamos el modelo y te enviamos una cotización detallada según material y tiempo."
                            },
                            {
                                icon: Printer,
                                title: "3. Impresión",
                                desc: "Una vez aprobado, iniciamos la impresión con nuestros equipos de alta gama."
                            },
                            {
                                icon: CheckCircle2,
                                title: "4. Entrega",
                                desc: "Retiralo por nuestro local o te lo enviamos a cualquier parte del país."
                            }
                        ].map((step, index) => (
                            <div key={index} className="relative group">
                                <div className="p-6 rounded-2xl bg-[hsl(var(--bg-primary))] border border-white/5 h-full hover:border-[hsl(var(--accent-primary))]/30 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-xl bg-[hsl(var(--bg-secondary))] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <step.icon className="w-7 h-7 text-[hsl(var(--accent-primary))]" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                                {index < 3 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                        <ArrowRight className="text-[hsl(var(--text-tertiary))]" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Materials Grid */}
            <div className="py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4">Materiales</h2>
                            <p className="text-[hsl(var(--text-secondary))] max-w-xl">
                                Seleccionamos los mejores filamentos y resinas para garantizar durabilidad y acabados estéticos superiores.
                            </p>
                        </div>
                        <Link href="/contact" className="text-[hsl(var(--accent-primary))] font-bold hover:underline">
                            ¿Necesitás un material especial?
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="group relative overflow-hidden rounded-2xl aspect-video">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
                                alt="PLA"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-0 left-0 p-6 z-20">
                                <h3 className="text-2xl font-bold mb-1">PLA / PLA+</h3>
                                <p className="text-gray-300 text-sm">Ideal para prototipos, figuras y uso general. Eco-friendly.</p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-2xl aspect-video">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=2070&auto=format&fit=crop"
                                alt="PETG"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-0 left-0 p-6 z-20">
                                <h3 className="text-2xl font-bold mb-1">PETG</h3>
                                <p className="text-gray-300 text-sm">Alta resistencia mecánica y térmica. Piezas funcionales.</p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-2xl aspect-video">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?q=80&w=2080&auto=format&fit=crop"
                                alt="Resina"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-0 left-0 p-6 z-20">
                                <h3 className="text-2xl font-bold mb-1">Resina UV</h3>
                                <p className="text-gray-300 text-sm">Máxima definición de detalle. Miniaturas y joyería.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="container mx-auto px-4 pb-24">
                <div className="rounded-3xl bg-gradient-to-br from-[hsl(var(--accent-primary))] to-purple-600 p-8 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">¿Tenés un proyecto en mente?</h2>
                        <p className="text-white/90 text-lg mb-8">
                            Envianos tu diseño y recibí una cotización en menos de 24 horas. ¡Hacemos envíos a todo el país!
                        </p>
                        <Link
                            href="https://wa.me/5491112345678"
                            target="_blank"
                            className="inline-flex items-center gap-2 bg-white text-[hsl(var(--accent-primary))] font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
                        >
                            <Send size={20} />
                            Contactar por WhatsApp
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

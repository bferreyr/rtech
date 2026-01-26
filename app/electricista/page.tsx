import { Zap, ShieldCheck, Home, Factory, Phone, CheckCircle2, Ruler, Clock, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function ElectricianPage() {
    return (
        <div className="min-h-screen bg-[hsl(var(--bg-primary))]">
            {/* Hero Section */}
            <div className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[#f59e0b]/5">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--bg-primary))] via-transparent to-[hsl(var(--bg-primary))]"></div>
                </div>

                <div className="container relative mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Zap size={14} className="text-[#f59e0b]" />
                        <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider">Servicio Profesional</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Soluciones Eléctricas <span className="text-[#f59e0b]">Integrales</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[hsl(var(--text-secondary))] max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Instalaciones, mantenimiento y reparaciones con la garantía y confianza de Roberto Leguiza.
                        Servicio para hogares, comercios e industrias.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link
                            href="https://wa.me/5491112345678"
                            target="_blank"
                            className="btn bg-[#f59e0b] hover:bg-[#d97706] text-white hover:text-white h-14 px-8 text-lg flex items-center gap-3 w-full sm:w-auto justify-center rounded-xl font-bold transition-all shadow-lg hover:shadow-[#f59e0b]/20"
                        >
                            <Phone size={20} />
                            Pedir Presupuesto
                        </Link>
                        <Link
                            href="#servicios"
                            className="h-14 px-8 text-lg flex items-center gap-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all w-full sm:w-auto justify-center font-bold"
                        >
                            Ver Servicios
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats / Trust Indicators */}
            <div className="container mx-auto px-4 -mt-20 relative z-10 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 text-center hover:border-[#f59e0b]/30 transition-colors">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-[#f59e0b]" />
                        </div>
                        <h3 className="text-xl font-black mb-1">Matriculado</h3>
                        <p className="text-[hsl(var(--text-secondary))] font-medium">Seguridad Garantizada</p>
                    </div>
                    <div className="glass-card p-8 text-center hover:border-[#f59e0b]/30 transition-colors">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-[#f59e0b]" />
                        </div>
                        <h3 className="text-xl font-black mb-1">Urgencias</h3>
                        <p className="text-[hsl(var(--text-secondary))] font-medium">Atención Rápida</p>
                    </div>
                    <div className="glass-card p-8 text-center hover:border-[#f59e0b]/30 transition-colors">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                            <Ruler className="w-6 h-6 text-[#f59e0b]" />
                        </div>
                        <h3 className="text-xl font-black mb-1">Presupuestos</h3>
                        <p className="text-[hsl(var(--text-secondary))] font-medium">Sin Cargo en Zona</p>
                    </div>
                </div>
            </div>

            {/* About Roberto */}
            <div className="py-24 bg-[hsl(var(--bg-secondary))]/30 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-[#f59e0b]/20 blur-3xl rounded-full"></div>
                            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2069&auto=format&fit=crop"
                                    alt="Electricista trabajando"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20">
                                <Zap size={14} className="text-[#f59e0b]" />
                                <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider">Roberto Leguiza</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black">Experiencia y Compromiso</h2>
                            <p className="text-[hsl(var(--text-secondary))] text-lg leading-relaxed">
                                Con años de trayectoria en el rubro, ofrezco soluciones eléctricas seguras y eficientes para tu hogar o negocio. Mi prioridad es realizar trabajos prolijos, cumpliendo con todas las normativas vigentes para garantizar tu seguridad.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#f59e0b]" />
                                    <span>Instalaciones Nuevas</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#f59e0b]" />
                                    <span>Cableado Estructurado</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#f59e0b]" />
                                    <span>Tableros Eléctricos</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#f59e0b]" />
                                    <span>Iluminación LED</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div id="servicios" className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Mis Servicios</h2>
                        <p className="text-[hsl(var(--text-secondary))]">Cobertura completa para todas tus necesidades eléctricas</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Residencial */}
                        <div className="group relative overflow-hidden rounded-2xl glass-card border-none">
                            <div className="absolute inset-0">
                                <img
                                    src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop"
                                    alt="Residencial"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            </div>
                            <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
                                <div className="w-12 h-12 rounded-xl bg-[#f59e0b] flex items-center justify-center mb-6 text-black">
                                    <Home size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Residencial</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Instalaciones completas, arreglo de cortocircuitos, colocación de luminarias y ventiladores.
                                </p>
                            </div>
                        </div>

                        {/* Comercial */}
                        <div className="group relative overflow-hidden rounded-2xl glass-card border-none">
                            <div className="absolute inset-0">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                                    alt="Comercial"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            </div>
                            <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
                                <div className="w-12 h-12 rounded-xl bg-[#f59e0b] flex items-center justify-center mb-6 text-black">
                                    <Lightbulb size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Comercial</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Iluminación de vidrieras, cartelería, aumento de potencia y mantenimiento preventivo.
                                </p>
                            </div>
                        </div>

                        {/* Industrial */}
                        <div className="group relative overflow-hidden rounded-2xl glass-card border-none">
                            <div className="absolute inset-0">
                                <img
                                    src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop"
                                    alt="Industrial"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            </div>
                            <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
                                <div className="w-12 h-12 rounded-xl bg-[#f59e0b] flex items-center justify-center mb-6 text-black">
                                    <Factory size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Industrial</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Tableros de potencia, automatización básica, bandejas portacables y trifásica.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="container mx-auto px-4 pb-24">
                <div className="rounded-3xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] p-8 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">¿Necesitás un electricista de confianza?</h2>
                        <p className="text-white/90 text-lg mb-8">
                            No arriesgues tu seguridad. Contactame hoy mismo para un asesoramiento profesional y presupuesto sin cargo.
                        </p>
                        <Link
                            href="https://wa.me/5491112345678"
                            target="_blank"
                            className="inline-flex items-center gap-2 bg-white text-[#d97706] font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
                        >
                            <Phone size={20} />
                            Contactar por WhatsApp
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

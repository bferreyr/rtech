import {
    Zap, Shield, Sparkles, Heart, ArrowRight,
    HeadphonesIcon, Handshake, Building2, CheckCircle2,
    MessageCircle, Clock, Star, Users
} from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function AboutPage() {
    return (
        <div className="min-h-screen">

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/about/hero.png"
                        alt="Rincón TECH"
                        className="w-full h-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg-primary))] via-[hsl(var(--bg-primary))]/60 to-transparent" />
                </div>

                <div className="container relative z-10 text-center px-4 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Heart className="w-4 h-4 text-[hsl(var(--accent-primary))] fill-[hsl(var(--accent-primary))]" />
                        <span className="text-sm font-medium">Empresa de familia · Santa Fe, Argentina</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Tecnología con{' '}
                        <span className="gradient-text">alma propia</span>
                    </h1>
                    <p className="text-xl text-[hsl(var(--text-secondary))] max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-700">
                        No somos solo una tienda. Somos el equipo que te acompaña antes, durante y después de cada compra.
                    </p>
                </div>
            </section>

            {/* ── Historia familiar ──────────────────────────────────────── */}
            <section className="container py-24 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[hsl(var(--accent-primary))]">Quiénes somos</p>
                            <h2 className="text-4xl font-bold tracking-tight">
                                Una familia que vive y respira <span className="gradient-text">tecnología</span>
                            </h2>
                        </div>
                        <div className="space-y-5 text-lg text-[hsl(var(--text-secondary))] leading-relaxed">
                            <p>
                                Rincón TECH nació de una idea simple: que comprar tecnología no debería ser una experiencia impersonal. Somos una empresa familiar de Santa Fe con algo que las grandes cadenas no pueden ofrecerte — el tiempo y la dedicación para escucharte de verdad.
                            </p>
                            <p>
                                Antes de recomendarte cualquier producto, entendemos tus necesidades, tu presupuesto y cómo vas a usarlo. No queremos venderte algo; queremos que estés genuinamente satisfecho con lo que llevás a tu casa o a tu empresa.
                            </p>
                            <p>
                                Para nosotros cada cliente es una relación a largo plazo, no una transacción. Eso explica por qué muchos vuelven — y nos traen a sus conocidos.
                            </p>
                        </div>
                        <div className="flex gap-4 pt-2">
                            <Link href="/contact" className="btn btn-primary">
                                Hablar con nosotros
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                            <Link href="/products" className="btn btn-secondary">
                                Ver productos
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden glass-card border-white/20">
                            <img
                                src="/images/about/commitment.png"
                                alt="Rincón TECH — compromiso con el cliente"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-8 glass-card p-6 space-y-1 animate-float">
                            <p className="text-3xl font-black gradient-text">100%</p>
                            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--text-secondary))]">Atención personalizada</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Valor agregado ────────────────────────────────────────── */}
            <section className="bg-white/5 py-24">
                <div className="container px-4">
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[hsl(var(--accent-primary))]">Por qué elegirnos</p>
                        <h2 className="text-4xl font-bold">
                            Más que una venta — <span className="gradient-text">una experiencia completa</span>
                        </h2>
                        <p className="text-[hsl(var(--text-secondary))] max-w-2xl mx-auto text-lg leading-relaxed">
                            Nuestro diferencial no está en el catálogo; está en la forma en que te tratamos a vos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <MessageCircle className="w-7 h-7 text-white" />,
                                color: "from-blue-500 to-cyan-500",
                                title: "Asesoramiento real",
                                desc: "Te explicamos todo sin tecnicismos. Analizamos tu caso puntual y te recomendamos lo que realmente necesitás, no lo más caro del catálogo.",
                            },
                            {
                                icon: <Clock className="w-7 h-7 text-white" />,
                                color: "from-violet-500 to-purple-600",
                                title: "Seguimiento post-venta",
                                desc: "No desaparecemos después de la compra. Te acompañamos en la instalación, configuración y ante cualquier duda que surja.",
                            },
                            {
                                icon: <Shield className="w-7 h-7 text-white" />,
                                color: "from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]",
                                title: "Confianza garantizada",
                                desc: "Productos 100% originales con garantía oficial. Si algo falla, estamos acá — sin vueltas ni formularios interminables.",
                            },
                            {
                                icon: <Star className="w-7 h-7 text-white" />,
                                color: "from-amber-400 to-orange-500",
                                title: "Relación duradera",
                                desc: "La mayoría de nuestros clientes vuelven y nos recomiendan. Nos importa más tu satisfacción que cerrar una venta rápida.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="glass-card p-8 space-y-5 hover:border-[hsl(var(--accent-primary))]/50 transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Proceso de compra ─────────────────────────────────────── */}
            <section className="container py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[hsl(var(--accent-primary))]">Cómo trabajamos</p>
                        <h2 className="text-4xl font-bold">Tu compra, paso a paso</h2>
                        <p className="text-[hsl(var(--text-secondary))] text-lg">
                            Un proceso simple, transparente y con persona real al otro lado.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { step: "01", title: "Nos contás qué necesitás", desc: "Ya sea por WhatsApp, mail o nuestra tienda online — nos explicás tu proyecto y tu presupuesto sin compromisos." },
                            { step: "02", title: "Te asesoramos sin apuro", desc: "Analizamos tu caso y te presentamos las opciones más adecuadas, explicando ventajas y diferencias de forma clara." },
                            { step: "03", title: "Realizás tu compra con confianza", desc: "Tus datos y tu pago están 100% protegidos. Productos originales con garantía oficial en cada pedido." },
                            { step: "04", title: "Te acompañamos después", desc: "Una vez que recibís tu pedido, seguimos disponibles para ayudarte con instalación, configuración o cualquier consulta." },
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-6 flex gap-6 items-start hover:border-[hsl(var(--accent-primary))]/40 transition-colors group">
                                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent-primary))]/20 to-[hsl(var(--accent-secondary))]/20 border border-[hsl(var(--accent-primary))]/30 flex items-center justify-center">
                                    <span className="text-lg font-black gradient-text">{item.step}</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1 group-hover:text-[hsl(var(--accent-primary))] transition-colors">{item.title}</h4>
                                    <p className="text-[hsl(var(--text-secondary))] leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Sección Empresas ──────────────────────────────────────── */}
            <section className="bg-gradient-to-b from-transparent via-white/5 to-transparent py-24">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                                    <Building2 className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
                                    <span className="text-sm font-bold uppercase tracking-wider">Para empresas</span>
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight">
                                    Tu socio tecnológico de <span className="gradient-text">confianza</span>
                                </h2>
                            </div>

                            <p className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed">
                                Trabajamos con PyMEs, estudios profesionales, comercios y organizaciones que necesitan equipar o actualizar su infraestructura tecnológica de forma eficiente y confiable. Entendemos que en el entorno empresarial el tiempo es crítico — por eso ofrecemos respuesta rápida, precios competitivos y atención dedicada.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Cotizaciones personalizadas sin cargo",
                                    "Facturación A y B disponible",
                                    "Compras por volumen con descuento",
                                    "Soporte técnico post-entrega",
                                    "Asesoramiento en infraestructura IT",
                                    "Entregas coordinadas a medida",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        <span className="text-[hsl(var(--text-secondary))] text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/empresas" className="btn btn-primary inline-flex">
                                Ver propuesta para empresas
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: <Users className="w-6 h-6 text-[hsl(var(--accent-primary))]" />, value: "+200", label: "Clientes satisfechos" },
                                { icon: <Handshake className="w-6 h-6 text-green-400" />, value: "+50", label: "Empresas atendidas" },
                                { icon: <HeadphonesIcon className="w-6 h-6 text-violet-400" />, value: "24 hs", label: "Tiempo de respuesta" },
                                { icon: <Star className="w-6 h-6 text-amber-400 fill-amber-400" />, value: "5★", label: "Valoración promedio" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="glass-card p-8 text-center space-y-4 hover:border-[hsl(var(--accent-primary))]/50 transition-all hover:-translate-y-1 duration-300"
                                >
                                    <div className="flex justify-center">{item.icon}</div>
                                    <p className="text-3xl font-black gradient-text">{item.value}</p>
                                    <p className="text-sm text-[hsl(var(--text-secondary))] font-medium">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pilares / Compromiso ──────────────────────────────────── */}
            <section className="container py-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { icon: <Zap className="w-8 h-8 text-[hsl(var(--accent-primary))]" />, title: "Productos originales", desc: "Todo nuestro stock es 100% original con garantía oficial. Sin imitaciones, sin sorpresas." },
                        { icon: <Shield className="w-8 h-8 text-[hsl(var(--accent-primary))]" />, title: "Compra segura", desc: "Tus datos y tu pago están protegidos. Operamos con las plataformas de pago más confiables del mercado." },
                        { icon: <Sparkles className="w-8 h-8 text-[hsl(var(--accent-primary))]" />, title: "Siempre disponibles", desc: "Cualquier duda antes o después de tu compra — estamos acá. Así de simple." },
                    ].map((item, i) => (
                        <div key={i} className="text-center space-y-4 group">
                            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[hsl(var(--accent-primary))]/40 transition-colors">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-bold">{item.title}</h4>
                            <p className="text-[hsl(var(--text-secondary))] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────────── */}
            <section className="container pb-24 px-4 text-center">
                <div className="glass-card py-16 px-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--accent-primary))]/10 to-[hsl(var(--accent-secondary))]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Heart className="w-10 h-10 text-[hsl(var(--accent-primary))] fill-[hsl(var(--accent-primary))]/30 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">¿Empezamos a trabajar juntos?</h2>
                    <p className="text-lg text-[hsl(var(--text-secondary))] mb-10 max-w-xl mx-auto">
                        Contactanos sin compromiso. Te respondemos rápido y te ayudamos a encontrar exactamente lo que necesitás.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="btn btn-primary h-14 px-10 text-lg group">
                            Escribirnos ahora
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/products" className="btn btn-secondary h-14 px-10 text-lg">
                            Explorar productos
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

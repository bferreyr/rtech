import { Zap, Shield, Sparkles, Target, Eye, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getRandomContent, ABOUT_TITLES, ABOUT_SUBTITLES } from "@/lib/marketing-content";

export const dynamic = 'force-dynamic';

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/about/hero.png"
                        alt="RTECH Hardware"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg-primary))] via-[hsl(var(--bg-primary))]/60 to-transparent" />
                </div>

                <div className="container relative z-10 text-center px-4 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
                        <span className="text-sm font-medium">Liderazgo en Hardware</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {getRandomContent(ABOUT_TITLES).split(' ').map((word, i, arr) => (
                            <span key={i}>
                                {i === arr.length - 1 ? <span className="gradient-text">{word}</span> : word}{' '}
                            </span>
                        ))}
                    </h1>
                    <p className="text-xl text-[hsl(var(--text-secondary))] max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {getRandomContent(ABOUT_SUBTITLES)}
                    </p>
                </div>
            </section>

            {/* Brand Story Section */}
            <section className="container py-24 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-bold tracking-tight">Especialistas en la <span className="text-[hsl(var(--accent-primary))]">Próxima Gen</span></h2>
                        <div className="space-y-4 text-lg text-[hsl(var(--text-secondary))] leading-relaxed">
                            <p>
                                RTECH nació de la pasión por los fierros. Entendemos que para proyectos ambiciosos, el hardware "estándar" no es suficiente. Por eso, nos especializamos exclusivamente en componentes de alto rendimiento.
                            </p>
                            <p>
                                Somos distribuidores autorizados de las marcas líderes a nivel mundial, lo que nos permite ofrecer no solo los últimos lanzamientos, sino también la tranquilidad de una garantía oficial y soporte técnico directo.
                            </p>
                            <p>
                                Ya sea que estés armando una workstation para renderizado, un servidor de datos local o la PC de gaming definitiva, nuestro equipo de expertos está aquí para asesorarte en cada elección técnica.
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Link href="/products" className="btn btn-primary">
                                Ver Componentes
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden glass-card border-white/20">
                            <img
                                src="/images/about/commitment.png"
                                alt="Hardware Commitment"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Stats Overlay */}
                        <div className="absolute -bottom-8 -left-8 glass-card p-8 space-y-2 animate-float">
                            <p className="text-4xl font-black gradient-text">100%</p>
                            <p className="text-sm font-medium text-[hsl(var(--text-secondary))] uppercase tracking-widest">Componentes Originales</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="bg-white/5 py-24">
                <div className="container px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold">Nuestra Propuesta de Valor</h2>
                        <p className="text-[hsl(var(--text-secondary))] max-w-xl mx-auto text-lg leading-relaxed">
                            Enfocados en proveer las mejores herramientas informáticas del mercado.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Misión */}
                        <div className="glass-card p-8 space-y-6 hover:border-[hsl(var(--accent-primary))]/50 transition-colors group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Misión</h3>
                            <p className="text-[hsl(var(--text-secondary))] leading-relaxed text-lg">
                                Proveer hardware de computación de vanguardia, facilitando el acceso a tecnología que potencie la productividad y el entretenimiento de alto nivel.
                            </p>
                        </div>

                        {/* Card 2: Visión */}
                        <div className="glass-card p-8 space-y-6 hover:border-[hsl(var(--accent-primary))]/50 transition-colors group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Eye className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Visión</h3>
                            <p className="text-[hsl(var(--text-secondary))] leading-relaxed text-lg">
                                Liderar el mercado de hardware e informática premium en Argentina, siendo el referente de confianza para todo profesional tech.
                            </p>
                        </div>

                        {/* Card 3: Valores */}
                        <div className="glass-card p-8 space-y-6 hover:border-[hsl(var(--accent-primary))]/50 transition-colors group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Heart className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Valores</h3>
                            <p className="text-[hsl(var(--text-secondary))] leading-relaxed text-lg">
                                Autenticidad en cada producto, rigurosidad técnica en el asesoramiento y una dedicación absoluta a la calidad del hardware que entregamos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="container py-24 px-4 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="aspect-square rounded-3xl overflow-hidden glass-card border-white/20 shadow-2xl relative group">
                            <img
                                src="/images/about/founders.png"
                                alt="Fundadores de Rincon Tech"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg-primary))]/80 via-transparent to-transparent opacity-60" />
                        </div>
                        {/* Decorative Badge */}
                        <div className="absolute -top-6 -right-6 glass-card p-6 rotate-12 animate-float">
                            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight">Detrás de <span className="gradient-text">Rincon Tech</span></h2>
                            <h3 className="text-xl font-medium text-[hsl(var(--accent-primary))]">Un Proyecto de Familia</h3>
                        </div>

                        <div className="space-y-6 text-lg text-[hsl(var(--text-secondary))] leading-relaxed font-light">
                            <p>
                                Rincon Tech no es solo una tienda de hardware; es el resultado de un sueño compartido. Llevado adelante por nosotros, una pareja apasionada por la informática, junto a nuestro pequeño gran integrante que ya empieza a curiosear entre motherboards y placas de video.
                            </p>
                            <p>
                                Para nosotros, cada cliente es más que una transacción. Entendemos que detrás de cada componente que nos piden hay un proyecto personal, un estudio de diseño, un sueño de streaming o el primer paso de un futuro programador.
                            </p>
                            <p>
                                Humanizar la tecnología premium es nuestro norte. Por eso, nos esforzamos en brindar un asesoramiento de persona a persona, con la misma dedicación con la que armamos nuestro propio setup en casa. ¡Bienvenidos a la familia Rincon Tech!
                            </p>
                        </div>

                        <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[hsl(var(--text-primary))]">Fundadores</span>
                                <span className="text-sm text-[hsl(var(--text-tertiary))]">Pasión & Tecnología</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Commitment Section (Features) */}
            <section className="container py-24 px-4 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-[hsl(var(--accent-primary))]" />
                        </div>
                        <h4 className="text-xl font-bold">Electrónica Pura</h4>
                        <p className="text-[hsl(var(--text-secondary))]">Componentes testeados y aprobados para el máximo rendimiento.</p>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-[hsl(var(--accent-primary))]" />
                        </div>
                        <h4 className="text-xl font-bold">Garantía Real</h4>
                        <p className="text-[hsl(var(--text-secondary))]">Respaldo directo y oficial de fabricantes líderes en cada compra.</p>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-[hsl(var(--accent-primary))]" />
                        </div>
                        <h4 className="text-xl font-bold">Soporte Experto</h4>
                        <p className="text-[hsl(var(--text-secondary))]">Asesoramiento especializado en compatibilidad y optimización de hardware.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container pb-24 px-4 text-center">
                <div className="glass-card py-16 px-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--accent-primary))]/10 to-[hsl(var(--accent-secondary))]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <h2 className="text-4xl font-bold mb-6">¿Listo para el siguiente nivel?</h2>
                    <p className="text-lg text-[hsl(var(--text-secondary))] mb-10 max-w-xl mx-auto">
                        Únete a los miles de profesionales que ya han potenciado su flujo de trabajo con RTECH.
                    </p>
                    <Link href="/products" className="btn btn-primary h-14 px-10 text-lg group">
                        Empezar Ahora
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

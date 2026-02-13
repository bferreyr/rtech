import { Search, Package, Truck, RotateCcw, User, MessageCircle, Mail, Phone, FileText, HelpCircle, ArrowRight, Shield, CreditCard, Settings } from "lucide-react"
import Link from "next/link"

const helpCategories = [
    {
        icon: Package,
        title: "Pedidos",
        description: "Seguimiento, modificaciones y estado de tus compras",
        color: "from-blue-500 to-cyan-500",
        links: [
            { label: "Hacer seguimiento", href: "/profile" },
            { label: "Modificar pedido", href: "/contact" },
            { label: "Cancelar pedido", href: "/contact" }
        ]
    },
    {
        icon: Truck,
        title: "Envíos",
        description: "Información sobre entregas y tiempos de envío",
        color: "from-purple-500 to-pink-500",
        links: [
            { label: "Calcular envío", href: "/checkout" },
            { label: "Tiempos de entrega", href: "/faq" },
            { label: "Retiro en local", href: "/contact" }
        ]
    },
    {
        icon: RotateCcw,
        title: "Devoluciones",
        description: "Política de devoluciones y cambios",
        color: "from-orange-500 to-red-500",
        links: [
            { label: "Solicitar devolución", href: "/profile" },
            { label: "Política de devoluciones", href: "/faq" },
            { label: "Estado de devolución", href: "/contact" }
        ]
    },
    {
        icon: Shield,
        title: "Garantías",
        description: "Reclamos de garantía y soporte técnico",
        color: "from-green-500 to-emerald-500",
        links: [
            { label: "Solicitar garantía", href: "/profile" },
            { label: "Cobertura de garantía", href: "/faq" },
            { label: "RMA y reparaciones", href: "/contact" }
        ]
    },
    {
        icon: CreditCard,
        title: "Pagos",
        description: "Métodos de pago, facturación y cuotas",
        color: "from-yellow-500 to-amber-500",
        links: [
            { label: "Métodos de pago", href: "/faq" },
            { label: "Facturación", href: "/faq" },
            { label: "Problemas de pago", href: "/contact" }
        ]
    },
    {
        icon: User,
        title: "Mi Cuenta",
        description: "Gestión de perfil y configuración",
        color: "from-indigo-500 to-blue-500",
        links: [
            { label: "Editar perfil", href: "/profile" },
            { label: "Cambiar contraseña", href: "/profile" },
            { label: "Mis puntos", href: "/profile" }
        ]
    }
]

const quickLinks = [
    {
        icon: FileText,
        title: "Preguntas Frecuentes",
        description: "Respuestas a las consultas más comunes",
        href: "/faq",
        color: "text-blue-400"
    },
    {
        icon: MessageCircle,
        title: "Contacto",
        description: "Envianos tu consulta por formulario",
        href: "/contact",
        color: "text-purple-400"
    },
    {
        icon: Phone,
        title: "WhatsApp",
        description: "Chateá con nosotros en tiempo real",
        href: "https://wa.me/5491112345678",
        color: "text-green-400",
        external: true
    },
    {
        icon: Mail,
        title: "Email",
        description: "ventas@rtech.com.ar",
        href: "mailto:ventas@rtech.com.ar",
        color: "text-orange-400",
        external: true
    }
]

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-primary))]/20 via-[hsl(var(--bg-primary))] to-[hsl(var(--accent-secondary))]/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent-primary))/10,transparent_50%)]" />

                <div className="container relative z-10 text-center px-4 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <HelpCircle className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
                        <span className="text-sm font-medium">Estamos para ayudarte</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Centro de <span className="gradient-text">Ayuda</span>
                    </h1>
                    <p className="text-xl text-[hsl(var(--text-secondary))] max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Encontrá respuestas rápidas, gestioná tus pedidos y contactanos cuando lo necesites.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <Link href="/faq" className="block">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--text-tertiary))]" size={20} />
                                <div className="w-full pl-12 pr-4 py-4 glass-card border-white/10 rounded-2xl hover:border-[hsl(var(--accent-primary))] transition-all text-lg shadow-2xl cursor-pointer text-[hsl(var(--text-tertiary))]">
                                    Buscá tu pregunta o tema...
                                </div>
                            </div>
                        </Link>
                        <p className="text-xs text-[hsl(var(--text-tertiary))] mt-2 text-center">Hacé clic para buscar en nuestras FAQ</p>
                    </div>
                </div>
            </section>

            {/* Help Categories */}
            <section className="container px-4 py-16">
                <h2 className="text-3xl font-bold mb-8 text-center">¿En qué podemos ayudarte?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {helpCategories.map((category, index) => {
                        const Icon = category.icon
                        return (
                            <div
                                key={index}
                                className="glass-card p-6 border-white/10 hover:border-[hsl(var(--accent-primary))]/30 transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                                <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">{category.description}</p>
                                <div className="space-y-2">
                                    {category.links.map((link, linkIndex) => (
                                        <Link
                                            key={linkIndex}
                                            href={link.href}
                                            className="flex items-center justify-between text-sm hover:text-[hsl(var(--accent-primary))] transition-colors group/link"
                                        >
                                            <span>{link.label}</span>
                                            <ArrowRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Quick Contact Links */}
            <section className="container px-4 py-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Contacto Rápido</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickLinks.map((link, index) => {
                        const Icon = link.icon
                        return (
                            <Link
                                key={index}
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                className="glass-card p-6 border-white/10 hover:border-[hsl(var(--accent-primary))]/30 transition-all group text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className={link.color} size={28} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{link.title}</h3>
                                <p className="text-sm text-[hsl(var(--text-secondary))]">{link.description}</p>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/* Popular Topics */}
            <section className="container px-4 py-16">
                <div className="glass-card p-12 border-white/10 bg-gradient-to-br from-[hsl(var(--accent-primary))]/10 via-transparent to-[hsl(var(--accent-secondary))]/10">
                    <h2 className="text-3xl font-bold mb-8 text-center">Temas Populares</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Link href="/faq" className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-[hsl(var(--accent-primary))]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Package size={20} className="text-[hsl(var(--accent-primary))]" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">¿Cómo hago seguimiento de mi pedido?</h3>
                                <p className="text-sm text-[hsl(var(--text-secondary))]">Ingresá a tu perfil para ver el estado en tiempo real</p>
                            </div>
                        </Link>

                        <Link href="/faq" className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-[hsl(var(--accent-secondary))]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Truck size={20} className="text-[hsl(var(--accent-secondary))]" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">¿Cuánto tarda el envío?</h3>
                                <p className="text-sm text-[hsl(var(--text-secondary))]">CABA/GBA: 2-4 días, Interior: 5-10 días hábiles</p>
                            </div>
                        </Link>

                        <Link href="/faq" className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <RotateCcw size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">¿Puedo devolver un producto?</h3>
                                <p className="text-sm text-[hsl(var(--text-secondary))]">Tenés 10 días corridos para arrepentirte de tu compra</p>
                            </div>
                        </Link>

                        <Link href="/faq" className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Shield size={20} className="text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">¿Cómo funciona la garantía?</h3>
                                <p className="text-sm text-[hsl(var(--text-secondary))]">Todos los productos tienen garantía oficial del fabricante</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Business Hours */}
            <section className="container px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-8 border-white/10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Settings className="text-[hsl(var(--accent-primary))]" />
                            Horarios de Atención
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="font-medium">Lunes - Viernes</span>
                                <span className="font-bold text-[hsl(var(--accent-primary))]">9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="font-medium">Sábados</span>
                                <span className="font-bold text-[hsl(var(--accent-primary))]">10:00 - 14:00</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="font-medium">Domingos</span>
                                <span className="font-bold text-red-400">Cerrado</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 border-white/10 bg-gradient-to-br from-[hsl(var(--accent-primary))]/5 to-transparent">
                        <h3 className="text-2xl font-bold mb-4">¿Necesitás ayuda inmediata?</h3>
                        <p className="text-[hsl(var(--text-secondary))] mb-6">
                            Nuestro equipo está disponible para resolver cualquier duda que tengas sobre productos, pedidos o garantías.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/contact"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white rounded-xl font-bold hover:scale-105 transition-all text-center shadow-lg shadow-[hsl(var(--accent-primary))]/20"
                            >
                                Contactanos
                            </Link>
                            <Link
                                href="https://wa.me/5491112345678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-6 py-3 glass-card border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all text-center"
                            >
                                WhatsApp
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

'use client'

import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"

export default function ContactPage() {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSubmitted(true)
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
            setTimeout(() => setSubmitted(false), 5000)
        })
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-primary))]/20 via-[hsl(var(--bg-primary))] to-[hsl(var(--accent-secondary))]/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent-primary))/10,transparent_50%)]" />

                <div className="container relative z-10 text-center px-4 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <MessageSquare className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
                        <span className="text-sm font-medium">Estamos para ayudarte</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Hablemos de tu <span className="gradient-text">Setup</span>
                    </h1>
                    <p className="text-xl text-[hsl(var(--text-secondary))] max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-700">
                        ¿Tenés dudas sobre qué componentes elegir? ¿Necesitás asesoramiento técnico? Nuestro equipo está listo para ayudarte.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="container px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="glass-card p-8 border-white/10 hover:border-[hsl(var(--accent-primary))]/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[hsl(var(--accent-primary))]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Mail className="text-[hsl(var(--accent-primary))]" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Email</h3>
                        <p className="text-[hsl(var(--text-secondary))] text-sm mb-3">Respondemos en menos de 24hs</p>
                        <a href="mailto:ventas@rtech.com.ar" className="text-[hsl(var(--accent-primary))] font-medium hover:underline">
                            ventas@rtech.com.ar
                        </a>
                    </div>

                    <div className="glass-card p-8 border-white/10 hover:border-[hsl(var(--accent-primary))]/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-[hsl(var(--accent-secondary))]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Phone className="text-[hsl(var(--accent-secondary))]" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Teléfono</h3>
                        <p className="text-[hsl(var(--text-secondary))] text-sm mb-3">Lun - Vie: 9:00 - 18:00</p>
                        <a href="tel:+5491112345678" className="text-[hsl(var(--accent-secondary))] font-medium hover:underline">
                            +54 9 11 1234-5678
                        </a>
                    </div>

                    <div className="glass-card p-8 border-white/10 hover:border-[hsl(var(--accent-primary))]/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MapPin className="text-purple-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Showroom</h3>
                        <p className="text-[hsl(var(--text-secondary))] text-sm mb-3">Con cita previa</p>
                        <p className="text-purple-400 font-medium">
                            Av. Corrientes 1234<br />
                            CABA, Argentina
                        </p>
                    </div>
                </div>

                {/* Main Contact Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <div className="glass-card p-8 md:p-12 border-white/10">
                        <h2 className="text-3xl font-bold mb-2">Envianos tu consulta</h2>
                        <p className="text-[hsl(var(--text-secondary))] mb-8">
                            Completá el formulario y te responderemos a la brevedad.
                        </p>

                        {submitted && (
                            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 animate-in fade-in slide-in-from-top-4">
                                <p className="font-bold">¡Mensaje enviado con éxito!</p>
                                <p className="text-sm">Te responderemos pronto.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">
                                        Nombre completo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">
                                        Asunto *
                                    </label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all appearance-none"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option value="">Seleccioná una opción</option>
                                        <option value="presupuesto">Solicitar Presupuesto</option>
                                        <option value="asesoria">Asesoría Técnica</option>
                                        <option value="garantia">Garantía / RMA</option>
                                        <option value="pedido">Estado de Pedido</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">
                                    Mensaje *
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Contanos en qué podemos ayudarte..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-[hsl(var(--accent-primary))]/20"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Enviar Mensaje
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Info & Map */}
                    <div className="space-y-8">
                        {/* Business Hours */}
                        <div className="glass-card p-8 border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-[hsl(var(--accent-primary))]" size={24} />
                                <h3 className="text-2xl font-bold">Horarios de Atención</h3>
                            </div>
                            <div className="space-y-3 text-[hsl(var(--text-secondary))]">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="font-medium">Lunes - Viernes</span>
                                    <span className="font-bold text-[hsl(var(--text-primary))]">9:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="font-medium">Sábados</span>
                                    <span className="font-bold text-[hsl(var(--text-primary))]">10:00 - 14:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium">Domingos</span>
                                    <span className="font-bold text-red-400">Cerrado</span>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="glass-card overflow-hidden border-white/10 h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878276937!2d-58.38375908477065!3d-34.60373098045943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf7e0e7e9f%3A0x3d6f0d6f0d6f0d6f!2sAv.%20Corrientes%2C%20Buenos%20Aires%2C%20Argentina!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>

                        {/* FAQ Quick Links */}
                        <div className="glass-card p-8 border-white/10 bg-gradient-to-br from-[hsl(var(--accent-primary))]/5 to-transparent">
                            <h3 className="text-xl font-bold mb-4">¿Buscás respuestas rápidas?</h3>
                            <p className="text-[hsl(var(--text-secondary))] mb-4 text-sm">
                                Revisá nuestras preguntas frecuentes antes de enviar tu consulta.
                            </p>
                            <a
                                href="/faq"
                                className="inline-flex items-center gap-2 text-[hsl(var(--accent-primary))] font-bold hover:gap-3 transition-all"
                            >
                                Ver FAQ
                                <Send size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Github } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-white/10 bg-[hsl(var(--bg-primary))]">
            {/* Decorative Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--accent-primary))]/5 to-transparent pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-black tracking-tighter gradient-text">RTECH</span>
                        </Link>
                        <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
                            Hardware premium para profesionales que no aceptan compromisos.
                            Tecnología de vanguardia a tu alcance.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-[hsl(var(--accent-primary))]/20 hover:text-[hsl(var(--accent-primary))] transition-all duration-300 group"
                            >
                                <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-[hsl(var(--accent-primary))]/20 hover:text-[hsl(var(--accent-primary))] transition-all duration-300 group"
                            >
                                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-[hsl(var(--accent-primary))]/20 hover:text-[hsl(var(--accent-primary))] transition-all duration-300 group"
                            >
                                <Twitter size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-[hsl(var(--accent-primary))]/20 hover:text-[hsl(var(--accent-primary))] transition-all duration-300 group"
                            >
                                <Github size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-[hsl(var(--text-primary))]">Navegación</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/pc-builder" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Armado de PC
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-[hsl(var(--text-primary))]">Soporte</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/help" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Centro de Ayuda
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Envíos
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/warranty" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Garantías
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors text-sm">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-[hsl(var(--text-primary))]">Contacto</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm">
                                <Mail size={16} className="text-[hsl(var(--accent-primary))] mt-0.5 flex-shrink-0" />
                                <a href="mailto:info@rtech.com" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors">
                                    info@rtech.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <Phone size={16} className="text-[hsl(var(--accent-primary))] mt-0.5 flex-shrink-0" />
                                <a href="tel:+5491112345678" className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors">
                                    +54 9 11 1234-5678
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin size={16} className="text-[hsl(var(--accent-primary))] mt-0.5 flex-shrink-0" />
                                <span className="text-[hsl(var(--text-secondary))]">
                                    Buenos Aires, Argentina
                                </span>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <p className="text-sm text-[hsl(var(--text-secondary))] mb-3">
                                Suscríbete a nuestro newsletter
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Tu email"
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-colors"
                                />
                                <button className="px-4 py-2 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-[hsl(var(--accent-glow))] transition-all duration-300">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                            © {currentYear} RTECH. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors">
                                Privacidad
                            </Link>
                            <Link href="/terms" className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors">
                                Términos
                            </Link>
                            <Link href="/cookies" className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

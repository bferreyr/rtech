'use client';

import Link from 'next/link';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

const WhatsappIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

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
                            <span className="text-3xl font-black tracking-tighter gradient-text">RINCÓN TECH</span>
                        </Link>
                        <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
                            Hardware premium para profesionales que no aceptan compromisos.
                            Tecnología de vanguardia a tu alcance.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://www.instagram.com/rincontech.ar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-[hsl(var(--accent-primary))]/20 hover:text-[hsl(var(--accent-primary))] transition-all duration-300 group"
                            >
                                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://wa.me/543425933763?text=Hola%2C%20me%20comunico%20desde%20la%20web%20de%20Rinc%C3%B3n%20TECH.%20Quisiera%20hacer%20una%20consulta."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-[hsl(var(--accent-primary))]/20 hover:text-[hsl(var(--accent-primary))] transition-all duration-300 group"
                            >
                                <WhatsappIcon size={18} className="group-hover:scale-110 transition-transform" />
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
                                <a
                                    href="https://wa.me/543425933763?text=Hola%2C%20me%20comunico%20desde%20la%20web%20de%20Rinc%C3%B3n%20TECH.%20Quisiera%20hacer%20una%20consulta."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors"
                                >
                                    +54 342 5933-763
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin size={16} className="text-[hsl(var(--accent-primary))] mt-0.5 flex-shrink-0" />
                                <span className="text-[hsl(var(--text-secondary))]">
                                    San José del Rincón, Santa Fe, Argentina
                                </span>
                            </li>
                        </ul>


                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                            © {currentYear} RINCÓN TECH. Todos los derechos reservados.
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

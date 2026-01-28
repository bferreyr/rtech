'use client'

import { useState } from "react"
import { ChevronDown, Search, HelpCircle, Package, CreditCard, Truck, Shield, Coins, Users } from "lucide-react"

const faqCategories = [
    {
        id: 'pedidos',
        title: 'Pedidos y Compras',
        icon: Package,
        questions: [
            {
                q: '¿Cómo realizo un pedido?',
                a: 'Navegá por nuestro catálogo, agregá los productos al carrito y hacé clic en "Finalizar Compra". Completá tus datos de envío y elegí el método de pago. Recibirás un email de confirmación con los detalles de tu pedido.'
            },
            {
                q: '¿Puedo modificar o cancelar mi pedido?',
                a: 'Podés modificar o cancelar tu pedido solo si aún no fue procesado. Contactanos inmediatamente a ventas@rtech.com.ar o por WhatsApp con tu número de pedido. Una vez que el pedido está en preparación, no es posible realizar cambios.'
            },
            {
                q: '¿Cómo puedo hacer seguimiento de mi pedido?',
                a: 'Ingresá a tu perfil en "Mis Pedidos" para ver el estado actualizado. Una vez despachado, recibirás el número de guía de Correo Argentino para hacer el seguimiento en tiempo real.'
            },
            {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos pagos a través de MODO, que te permite pagar con tus billeteras virtuales y aplicaciones bancarias. Todos los pagos son procesados de forma segura.'
            }
        ]
    },
    {
        id: 'envios',
        title: 'Envíos y Entregas',
        icon: Truck,
        questions: [
            {
                q: '¿Hacen envíos a todo el país?',
                a: 'Sí, realizamos envíos a todo el territorio argentino a través de Correo Argentino. El costo y tiempo de entrega varían según tu código postal.'
            },
            {
                q: '¿Cuánto tarda en llegar mi pedido?',
                a: 'Los tiempos de entrega dependen de tu ubicación: CABA y GBA (2-4 días hábiles), Interior del país (5-10 días hábiles). Los plazos comienzan a contar desde que el pedido es despachado.'
            },
            {
                q: '¿Cuánto cuesta el envío?',
                a: 'El costo de envío se calcula automáticamente según tu código postal y el peso del pedido. Podés verlo en el checkout antes de confirmar la compra. ¡Ofrecemos envío gratis en compras superiores a $150.000!'
            },
            {
                q: '¿Puedo retirar mi pedido en persona?',
                a: 'Sí, ofrecemos retiro en nuestro showroom en Av. Corrientes 1234, CABA. Seleccioná la opción "Retiro en Local" durante el checkout. Te notificaremos cuando tu pedido esté listo para retirar (generalmente en 24-48hs).'
            }
        ]
    },
    {
        id: 'productos',
        title: 'Productos y Stock',
        icon: HelpCircle,
        questions: [
            {
                q: '¿Los productos tienen garantía?',
                a: 'Todos nuestros productos cuentan con garantía oficial del fabricante. El plazo varía según la marca: generalmente 1 año para periféricos, 2-3 años para componentes principales. Somos distribuidores autorizados, por lo que gestionamos directamente cualquier reclamo de garantía.'
            },
            {
                q: '¿Cómo sé si un producto está en stock?',
                a: 'El stock se actualiza en tiempo real en nuestra web. Si un producto muestra "Agregar al Carrito", está disponible. Si dice "Sin Stock", podés activar la notificación para recibir un email cuando vuelva a estar disponible.'
            },
            {
                q: '¿Puedo armar una PC personalizada?',
                a: 'Sí, contamos con un Configurador de PC en nuestra web donde podés seleccionar cada componente. El sistema verifica automáticamente la compatibilidad entre piezas. Si necesitás asesoramiento, nuestro equipo técnico puede ayudarte.'
            },
            {
                q: '¿Ofrecen asesoramiento técnico?',
                a: 'Absolutamente. Nuestro equipo de especialistas está disponible para ayudarte a elegir los componentes ideales según tu presupuesto y necesidades. Contactanos por email, WhatsApp o visitá nuestro showroom.'
            }
        ]
    },
    {
        id: 'pagos',
        title: 'Pagos y Facturación',
        icon: CreditCard,
        questions: [
            {
                q: '¿Emiten factura?',
                a: 'Sí, emitimos factura A o B según corresponda. Indicá tus datos fiscales (CUIT/CUIL) durante el checkout. La factura electrónica se envía automáticamente a tu email una vez procesado el pago.'
            },
            {
                q: '¿Puedo pagar en cuotas?',
                a: 'Sí, a través de MODO podés acceder a las promociones y cuotas que ofrezca tu banco o billetera virtual. Las opciones disponibles dependerán de tu medio de pago seleccionado.'
            },
            {
                q: '¿Qué hago si mi pago fue rechazado?',
                a: 'Verificá que los datos de tu tarjeta sean correctos y que tengas fondos disponibles. Si el problema persiste, intentá con otro método de pago o contactá a tu banco. También podés comunicarte con nosotros para asistencia.'
            }
        ]
    },
    {
        id: 'puntos',
        title: 'Programa de Puntos',
        icon: Coins,
        questions: [
            {
                q: '¿Cómo funciona el sistema de puntos?',
                a: 'Por cada compra ganás 1 punto por cada $100 gastados. Los puntos se acreditan automáticamente cuando tu pedido es confirmado como pagado. Podés ver tu saldo en tu perfil o en el menú de usuario.'
            },
            {
                q: '¿Cómo canjeo mis puntos?',
                a: 'Durante el checkout, podés canjear tus puntos por descuentos. 1 punto = $1 de descuento. Podés usar hasta el 50% del valor de tu pedido en puntos. El descuento se aplica antes del envío.'
            },
            {
                q: '¿Los puntos tienen vencimiento?',
                a: 'Actualmente los puntos no tienen fecha de vencimiento. Podés acumularlos y usarlos cuando quieras en futuras compras.'
            },
            {
                q: '¿Puedo transferir puntos a otra cuenta?',
                a: 'No, los puntos son personales e intransferibles. Solo pueden ser utilizados por el titular de la cuenta que los acumuló.'
            }
        ]
    },
    {
        id: 'devoluciones',
        title: 'Devoluciones y Garantías',
        icon: Shield,
        questions: [
            {
                q: '¿Puedo devolver un producto?',
                a: 'Sí, tenés 10 días corridos desde la recepción del producto para arrepentirte de la compra (Ley de Defensa del Consumidor). El producto debe estar sin uso, en su embalaje original y con todos los accesorios. Contactanos para iniciar el proceso.'
            },
            {
                q: '¿Qué hago si recibo un producto defectuoso?',
                a: 'Contactanos inmediatamente con fotos del producto y descripción del problema. Evaluaremos el caso y gestionaremos el cambio o reparación según corresponda bajo garantía del fabricante.'
            },
            {
                q: '¿Cómo inicio un reclamo de garantía?',
                a: 'Ingresá a tu perfil, buscá el pedido correspondiente y hacé clic en "Solicitar Garantía". Completá el formulario con los detalles del problema. Nuestro equipo técnico evaluará el caso y te guiará en los próximos pasos.'
            },
            {
                q: '¿Quién se hace cargo del envío en devoluciones?',
                a: 'Si la devolución es por arrepentimiento, el costo del envío corre por cuenta del cliente. Si es por producto defectuoso o error en el envío, nosotros nos hacemos cargo del costo de envío.'
            }
        ]
    },
    {
        id: 'cuenta',
        title: 'Mi Cuenta',
        icon: Users,
        questions: [
            {
                q: '¿Necesito crear una cuenta para comprar?',
                a: 'Sí, necesitás crear una cuenta para realizar compras. Esto te permite hacer seguimiento de tus pedidos, acumular puntos, guardar direcciones de envío y acceder a tu historial de compras.'
            },
            {
                q: '¿Cómo recupero mi contraseña?',
                a: 'En la página de login, hacé clic en "¿Olvidaste tu contraseña?". Ingresá tu email y recibirás un link para restablecer tu contraseña.'
            },
            {
                q: '¿Puedo cambiar mis datos personales?',
                a: 'Sí, ingresá a tu perfil y hacé clic en "Editar Perfil" para actualizar tu nombre, email, teléfono y direcciones de envío.'
            },
            {
                q: '¿Cómo elimino mi cuenta?',
                a: 'Para eliminar tu cuenta, contactanos a ventas@rtech.com.ar solicitando la baja. Ten en cuenta que perderás todo tu historial de compras y puntos acumulados.'
            }
        ]
    }
]

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [openItems, setOpenItems] = useState<string[]>([])

    const toggleItem = (categoryId: string, questionIndex: number) => {
        const itemId = `${categoryId}-${questionIndex}`
        setOpenItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    const filteredCategories = faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0)

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-[hsl(var(--bg-primary))] to-blue-500/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent-primary))/10,transparent_50%)]" />

                <div className="container relative z-10 text-center px-4 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <HelpCircle className="w-4 h-4 text-[hsl(var(--accent-primary))]" />
                        <span className="text-sm font-medium">Centro de Ayuda</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Preguntas <span className="gradient-text">Frecuentes</span>
                    </h1>
                    <p className="text-xl text-[hsl(var(--text-secondary))] max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Encontrá respuestas rápidas a las consultas más comunes sobre compras, envíos, garantías y más.
                    </p>
                </div>
            </section>

            {/* Search Bar */}
            <section className="container px-4 -mt-8 relative z-20">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--text-tertiary))]" size={20} />
                        <input
                            type="text"
                            placeholder="Buscá tu pregunta..."
                            className="w-full pl-12 pr-4 py-4 glass-card border-white/10 rounded-2xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all text-lg shadow-2xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="container px-4 py-16">
                {searchTerm && filteredCategories.length === 0 ? (
                    <div className="text-center py-20">
                        <HelpCircle className="w-16 h-16 mx-auto text-[hsl(var(--text-tertiary))] opacity-20 mb-4" />
                        <p className="text-xl text-[hsl(var(--text-secondary))]">No encontramos resultados para "{searchTerm}"</p>
                        <p className="text-sm text-[hsl(var(--text-tertiary))] mt-2">Intentá con otras palabras o contactanos directamente</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredCategories.map((category) => {
                            const Icon = category.icon
                            return (
                                <div key={category.id} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--accent-primary))]/10 flex items-center justify-center">
                                            <Icon className="text-[hsl(var(--accent-primary))]" size={20} />
                                        </div>
                                        <h2 className="text-3xl font-bold">{category.title}</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {category.questions.map((item, index) => {
                                            const itemId = `${category.id}-${index}`
                                            const isOpen = openItems.includes(itemId)

                                            return (
                                                <div
                                                    key={index}
                                                    className="glass-card border-white/10 overflow-hidden hover:border-[hsl(var(--accent-primary))]/30 transition-all"
                                                >
                                                    <button
                                                        onClick={() => toggleItem(category.id, index)}
                                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                                    >
                                                        <span className="font-bold text-lg pr-4">{item.q}</span>
                                                        <ChevronDown
                                                            className={`flex-shrink-0 text-[hsl(var(--accent-primary))] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                                                }`}
                                                            size={20}
                                                        />
                                                    </button>
                                                    <div
                                                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'
                                                            }`}
                                                    >
                                                        <div className="px-6 pb-5 pt-2 text-[hsl(var(--text-secondary))] leading-relaxed border-t border-white/5">
                                                            {item.a}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* Contact CTA */}
            <section className="container px-4 pb-24">
                <div className="glass-card p-12 text-center border-white/10 bg-gradient-to-br from-[hsl(var(--accent-primary))]/10 via-transparent to-[hsl(var(--accent-secondary))]/10">
                    <h2 className="text-3xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
                    <p className="text-[hsl(var(--text-secondary))] mb-8 max-w-2xl mx-auto">
                        Nuestro equipo está disponible para ayudarte con cualquier consulta que tengas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="px-8 py-4 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-[hsl(var(--accent-primary))]/20"
                        >
                            Contactanos
                        </a>
                        <a
                            href="https://wa.me/5491112345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 glass-card border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

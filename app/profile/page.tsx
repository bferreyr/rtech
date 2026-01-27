'use client';

import { useEffect, useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { notFound, redirect } from "next/navigation"
import { ShoppingBag, Package, MapPin, Calendar, ArrowRight, User as UserIcon, Coins, History as HistoryIcon, X, Loader2, AlertCircle, Box, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ModelViewer } from "@/components/3d/ModelViewer"
import { formatCurrency } from "@/lib/utils"


export default function ProfilePage() {
    const { data: session } = useSession()
    const [isPending, startTransition] = useTransition()
    const [orders, setOrders] = useState<any[]>([])
    const [printingJobs, setPrintingJobs] = useState<any[]>([])
    const [dbUser, setDbUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Modal states
    const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false)
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

    // Form states
    const [warrantyForm, setWarrantyForm] = useState({
        orderId: '',
        productName: '',
        issue: '',
        description: ''
    })
    const [returnForm, setReturnForm] = useState({
        orderId: '',
        reason: '',
        description: ''
    })
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    const [submitSuccess, setSubmitSuccess] = useState(false)

    useEffect(() => {
        if (!session?.user) {
            redirect("/login")
        }

        // Fetch user data
        const fetchData = async () => {
            try {
                const response = await fetch('/api/profile/data')
                const data = await response.json()
                setOrders(data.orders || [])
                setPrintingJobs(data.printingJobs || [])
                setDbUser(data.user)
                setProfileForm({
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    phone: data.user?.phone || '',
                    address: data.user?.address || ''
                })
            } catch (error) {
                console.error('Error fetching profile data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [session])

    const handleWarrantySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSubmitSuccess(true)
            setIsWarrantyModalOpen(false)
            setWarrantyForm({ orderId: '', productName: '', issue: '', description: '' })
            setTimeout(() => setSubmitSuccess(false), 3000)
        })
    }

    const handleReturnSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSubmitSuccess(true)
            setIsReturnModalOpen(false)
            setReturnForm({ orderId: '', reason: '', description: '' })
            setTimeout(() => setSubmitSuccess(false), 3000)
        })
    }

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSubmitSuccess(true)
            setIsEditProfileModalOpen(false)
            setTimeout(() => setSubmitSuccess(false), 3000)
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--accent-primary))]" />
            </div>
        )
    }

    if (!dbUser) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12 space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter">Mi Perfil</h1>
                    <p className="text-[hsl(var(--text-secondary))]">Gestioná tus datos y realizá el seguimiento de tus pedidos.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Points Card */}
                    <div className="flex items-center gap-4 p-4 glass-card border-[hsl(var(--accent-secondary))]/30 bg-gradient-to-br from-[hsl(var(--accent-secondary))]/10 to-transparent rounded-2xl min-w-[200px]">
                        <div className="w-12 h-12 rounded-full bg-[hsl(var(--accent-secondary))]/20 flex items-center justify-center text-[hsl(var(--accent-secondary))]">
                            <Coins size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Mis Puntos</p>
                            {/* @ts-ignore */}
                            <p className="text-2xl font-black text-[hsl(var(--accent-secondary))]">{dbUser.points || 0}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 glass-card border-white/10 rounded-2xl bg-white/5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center text-lg font-bold">
                            {session?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="font-bold">{session?.user?.name || 'Usuario'}</p>
                            <p className="text-xs text-[hsl(var(--text-tertiary))]">{session?.user?.email || ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loyalty Points History (Horizontal Scroll on Mobile) */}
            {/* @ts-ignore */}
            {dbUser.pointHistory && dbUser.pointHistory.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <HistoryIcon className="text-[hsl(var(--accent-secondary))]" />
                            <h2 className="text-2xl font-bold tracking-tight">Historial de Puntos</h2>
                        </div>
                        <span className="text-xs font-bold text-[hsl(var(--text-tertiary))] uppercase tracking-widest">
                            {/* @ts-ignore */}
                            {dbUser.pointHistory.length} transacciones
                        </span>
                    </div>

                    <div className="glass-card border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Fecha</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Concepto</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))] text-right">Puntos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {/* @ts-ignore */}
                                    {dbUser.pointHistory.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-sm text-[hsl(var(--text-tertiary))]">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">{item.description}</span>
                                                    <span className="text-[10px] text-[hsl(var(--text-tertiary))] uppercase">{item.type}</span>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-black ${item.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {item.amount > 0 ? '+' : ''}{item.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* 3D Printing Jobs Section */}
            {printingJobs.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Box className="text-[hsl(var(--accent-primary))]" />
                        <h2 className="text-2xl font-bold tracking-tight">Mis Impresiones 3D</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {printingJobs.map((job: any) => (
                            <div key={job.id} className="glass-card p-6 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">{job.title}</h3>
                                        <p className="text-sm text-[hsl(var(--text-secondary))]">{job.description}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${job.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        job.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {job.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> :
                                            job.status === 'IN_PROGRESS' ? <Clock className="w-3 h-3" /> :
                                                <Clock className="w-3 h-3" />}
                                        {job.status}
                                    </span>
                                </div>

                                {/* 3D Viewer Integration */}
                                <div className="rounded-xl overflow-hidden bg-black/50 border border-white/5">
                                    <ModelViewer url={job.fileUrl} className="h-[300px]" />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm">
                                    <div className="flex items-center gap-2 text-[hsl(var(--text-secondary))]">
                                        <Box className="w-4 h-4" />
                                        <span className="font-mono text-xs">{job.fileName}</span>
                                    </div>
                                    {job.price && (
                                        <div className="font-bold text-lg text-[hsl(var(--accent-primary))]">
                                            {formatCurrency(Number(job.price))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Orders Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="text-[hsl(var(--accent-primary))]" />
                    <h2 className="text-2xl font-bold tracking-tight">Mis Compras</h2>
                </div>

                {orders.length === 0 ? (
                    <div className="glass-card p-20 text-center space-y-6 border-dashed border-white/10">
                        <Package className="w-16 h-16 mx-auto text-[hsl(var(--text-tertiary))] opacity-20" />
                        <div className="space-y-2">
                            <p className="text-xl font-medium">Aún no tenés pedidos</p>
                            <p className="text-[hsl(var(--text-secondary))]">¡Empezá a armar tu setup ahora mismo!</p>
                        </div>
                        <Link href="/products" className="btn btn-primary inline-flex">
                            Explorar Tienda
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {orders.map((order: any) => (
                            <div key={order.id} className="glass-card border-white/10 overflow-hidden group hover:border-[hsl(var(--accent-primary))]/30 transition-all">
                                <div className="p-6 md:p-8 space-y-6">
                                    {/* Order Top Info */}
                                    <div className="flex flex-col md:flex-row justify-between gap-4 pb-6 border-b border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={14} className="text-[hsl(var(--text-tertiary))]" />
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Estado</p>
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === 'PAID' ? 'bg-green-500/10 text-green-400' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Total</p>
                                                <p className="text-lg font-black gradient-text">USD {Number(order.total).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-4">
                                        {(order as any).items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                                                    {item.product.imageUrl && (
                                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                                                    <p className="text-xs text-[hsl(var(--text-tertiary))]">Cant: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-bold">USD {Number(item.price).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Info */}
                                    {order.shipment && (
                                        <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <MapPin size={48} />
                                            </div>
                                            <h4 className="font-bold flex items-center gap-2">
                                                <Package size={16} className="text-[hsl(var(--accent-primary))]" />
                                                Seguimiento de Envío
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Número de Guía</p>
                                                    <p className="text-sm font-mono text-[hsl(var(--accent-primary))]">{order.shipment.trackingNumber || 'Pendiente de asignación'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Empresa</p>
                                                    <p className="text-sm">{order.shipment.carrier}</p>
                                                </div>
                                            </div>
                                            {order.shipment.trackingNumber && (
                                                <a
                                                    href={`https://www.correoargentino.com.ar/formularios/e-commerce?id=${order.shipment.trackingNumber}`}
                                                    target="_blank"
                                                    className="btn btn-secondary w-full py-3 text-xs uppercase tracking-widest font-bold"
                                                >
                                                    Ver en Correo Argentino
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Account Settings / Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10">
                <div className="glass-card p-8 space-y-4 border-white/5 hover:border-[hsl(var(--accent-primary))]/30 transition-all">
                    <ShieldCheck className="text-[hsl(var(--accent-primary))]" />
                    <h4 className="text-xl font-bold">Garantías</h4>
                    <p className="text-sm text-[hsl(var(--text-secondary))]">Consultá el estado de garantía de tus componentes adquiridos.</p>
                    <button onClick={() => setIsWarrantyModalOpen(true)} className="text-xs font-bold uppercase tracking-widest hover:text-[hsl(var(--accent-primary))] transition-colors">Solicitar Reclamo</button>
                </div>
                <div className="glass-card p-8 space-y-4 border-white/5 hover:border-[hsl(var(--accent-primary))]/30 transition-all">
                    <RotateCcw className="text-[hsl(var(--accent-primary))]" />
                    <h4 className="text-xl font-bold">Devoluciones</h4>
                    <p className="text-sm text-[hsl(var(--text-secondary))]">Iniciá o seguí el estado de una devolución de producto.</p>
                    <button onClick={() => setIsReturnModalOpen(true)} className="text-xs font-bold uppercase tracking-widest hover:text-[hsl(var(--accent-primary))] transition-colors">Solicitar Devolución</button>
                </div>
                <div className="glass-card p-8 space-y-4 border-white/5 hover:border-[hsl(var(--accent-primary))]/30 transition-all">
                    <UserIcon className="text-[hsl(var(--accent-primary))]" />
                    <h4 className="text-xl font-bold">Mi Cuenta</h4>
                    <p className="text-sm text-[hsl(var(--text-secondary))]">Actualizá tus datos personales y dirección de envío.</p>
                    <button onClick={() => setIsEditProfileModalOpen(true)} className="text-xs font-bold uppercase tracking-widest hover:text-[hsl(var(--accent-primary))] transition-colors">Editar Perfil</button>
                </div>


            </div>

            {/* Success Notification */}
            {submitSuccess && (
                <div className="fixed top-4 right-4 z-[70] glass-card p-4 border-green-500/20 bg-green-500/10 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <AlertCircle className="text-green-400" size={16} />
                        </div>
                        <div>
                            <p className="font-bold text-green-400">¡Solicitud enviada!</p>
                            <p className="text-xs text-green-400/70">Te contactaremos pronto.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Warranty Claim Modal */}
            {isWarrantyModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-card w-full max-w-2xl p-8 border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Solicitar Reclamo de Garantía</h2>
                            <button onClick={() => setIsWarrantyModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleWarrantySubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Número de Pedido *</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={warrantyForm.orderId}
                                    onChange={(e) => setWarrantyForm({ ...warrantyForm, orderId: e.target.value })}
                                >
                                    <option value="">Seleccioná un pedido</option>
                                    {orders.map((order: any) => (
                                        <option key={order.id} value={order.id}>
                                            #{order.id.slice(-8).toUpperCase()} - {new Date(order.createdAt).toLocaleDateString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Producto *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nombre del producto con problema"
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={warrantyForm.productName}
                                    onChange={(e) => setWarrantyForm({ ...warrantyForm, productName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Tipo de Problema *</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={warrantyForm.issue}
                                    onChange={(e) => setWarrantyForm({ ...warrantyForm, issue: e.target.value })}
                                >
                                    <option value="">Seleccioná el tipo de problema</option>
                                    <option value="no_enciende">No enciende</option>
                                    <option value="rendimiento">Problemas de rendimiento</option>
                                    <option value="ruido">Ruidos anormales</option>
                                    <option value="sobrecalentamiento">Sobrecalentamiento</option>
                                    <option value="defecto_fisico">Defecto físico</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Descripción del Problema *</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Describí en detalle el problema que estás experimentando..."
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all resize-none"
                                    value={warrantyForm.description}
                                    onChange={(e) => setWarrantyForm({ ...warrantyForm, description: e.target.value })}
                                />
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                <p className="text-xs text-blue-400 font-bold mb-2">📋 Información importante:</p>
                                <ul className="text-xs text-blue-400/70 space-y-1 list-disc list-inside">
                                    <li>Nuestro equipo técnico evaluará tu caso en 24-48hs</li>
                                    <li>Podríamos solicitar fotos o videos del problema</li>
                                    <li>La garantía cubre defectos de fabricación, no daños por mal uso</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar Solicitud'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {isReturnModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-card w-full max-w-2xl p-8 border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Solicitar Devolución</h2>
                            <button onClick={() => setIsReturnModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleReturnSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Número de Pedido *</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={returnForm.orderId}
                                    onChange={(e) => setReturnForm({ ...returnForm, orderId: e.target.value })}
                                >
                                    <option value="">Seleccioná un pedido</option>
                                    {orders.map((order: any) => (
                                        <option key={order.id} value={order.id}>
                                            #{order.id.slice(-8).toUpperCase()} - {new Date(order.createdAt).toLocaleDateString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Motivo de Devolución *</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={returnForm.reason}
                                    onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                                >
                                    <option value="">Seleccioná un motivo</option>
                                    <option value="arrepentimiento">Arrepentimiento de compra</option>
                                    <option value="producto_incorrecto">Producto incorrecto</option>
                                    <option value="defectuoso">Producto defectuoso</option>
                                    <option value="no_cumple_expectativas">No cumple expectativas</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Detalles *</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Contanos por qué querés devolver el producto..."
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all resize-none"
                                    value={returnForm.description}
                                    onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })}
                                />
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                <p className="text-xs text-yellow-400 font-bold mb-2">⚠️ Política de devoluciones:</p>
                                <ul className="text-xs text-yellow-400/70 space-y-1 list-disc list-inside">
                                    <li>Tenés 10 días corridos desde la recepción para devolver</li>
                                    <li>El producto debe estar sin uso y en su embalaje original</li>
                                    <li>Los costos de envío por arrepentimiento corren por tu cuenta</li>
                                    <li>El reembolso se procesa en 5-10 días hábiles</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar Solicitud'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {isEditProfileModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-card w-full max-w-md p-8 border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Editar Perfil</h2>
                            <button onClick={() => setIsEditProfileModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Nombre Completo *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Email *</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Teléfono</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-2">Dirección</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all resize-none"
                                    value={profileForm.address}
                                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

function RotateCcw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    )
}

'use client'

import { useState, useEffect, useTransition } from 'react'
import { getUsers, toggleUserBlock, toggleUserPurchase, createUser, updateUser, adjustUserPoints } from '@/app/actions/users'
import { Users, Shield, ShieldOff, ShoppingBag, Ban, CheckCircle, Search, Loader2, Edit, Plus, Coins, X } from 'lucide-react'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(true)

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isPointsModalOpen, setIsPointsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)

    // Form states
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        role: 'USER',
        points: 0
    })
    const [pointsData, setPointsData] = useState({
        amount: 0,
        description: ''
    })

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        setLoading(true)
        const data = await getUsers()
        setUsers(data)
        setLoading(false)
    }

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleToggleBlock = (userId: string) => {
        startTransition(async () => {
            const res = await toggleUserBlock(userId)
            if (res.success) loadUsers()
        })
    }

    const handleTogglePurchase = (userId: string) => {
        startTransition(async () => {
            const res = await toggleUserPurchase(userId)
            if (res.success) loadUsers()
        })
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const res = await createUser(formData)
            if (res.success) {
                setIsCreateModalOpen(false)
                setFormData({ email: '', name: '', password: '', role: 'USER', points: 0 })
                loadUsers()
            } else {
                alert(res.error)
            }
        })
    }

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const res = await updateUser(selectedUser.id, formData)
            if (res.success) {
                setIsEditModalOpen(false)
                loadUsers()
            } else {
                alert(res.error)
            }
        })
    }

    const handleAdjustPoints = async (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const res = await adjustUserPoints(selectedUser.id, pointsData.amount, pointsData.description)
            if (res.success) {
                setIsPointsModalOpen(false)
                setPointsData({ amount: 0, description: '' })
                loadUsers()
            } else {
                alert(res.error)
            }
        })
    }

    const openEditModal = (user: any) => {
        setSelectedUser(user)
        setFormData({
            email: user.email,
            name: user.name || '',
            password: '', // Don't show password
            role: user.role,
            points: user.points || 0
        })
        setIsEditModalOpen(true)
    }

    const openPointsModal = (user: any) => {
        setSelectedUser(user)
        setPointsData({ amount: 0, description: 'Ajuste administrativo' })
        setIsPointsModalOpen(true)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Gestión de Usuarios</h1>
                    <p className="text-[hsl(var(--text-secondary))]">
                        Administra el acceso, permisos de compra y estados de los clientes.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-tertiary))]" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-10 pr-4 py-2 w-full md:w-64 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--accent-primary))] text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-[hsl(var(--accent-primary))]/20"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Nuevo Usuario</span>
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-sm font-bold">Usuario</th>
                                <th className="px-6 py-4 text-sm font-bold text-center">Rol</th>
                                <th className="px-6 py-4 text-sm font-bold text-center">Puntos</th>
                                <th className="px-6 py-4 text-sm font-bold text-center">Compras</th>
                                <th className="px-6 py-4 text-sm font-bold text-center">Estado</th>
                                <th className="px-6 py-4 text-sm font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[hsl(var(--accent-primary))]" />
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{user.name || 'Sin nombre'}</span>
                                            <span className="text-xs text-[hsl(var(--text-tertiary))]">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-[hsl(var(--accent-secondary))]">
                                        {user.points || 0}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-medium">{user._count?.orders || 0}</span>
                                            <button
                                                onClick={() => handleTogglePurchase(user.id)}
                                                disabled={isPending || user.role === 'ADMIN'}
                                                className={`mt-1 flex items-center gap-1 text-[10px] uppercase font-black transition-colors ${user.canPurchase ? 'text-green-500 hover:text-green-400' : 'text-red-500 hover:text-red-400'
                                                    }`}
                                            >
                                                {user.canPurchase ? (
                                                    <><CheckCircle size={10} /> Habilitado</>
                                                ) : (
                                                    <><Ban size={10} /> Deshabilitado</>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${user.isBlocked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            }`}>
                                            {user.isBlocked ? 'BLOQUEADO' : 'ACTIVO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openPointsModal(user)}
                                                className="p-2 rounded-lg bg-[hsl(var(--accent-secondary))]/10 text-[hsl(var(--accent-secondary))] hover:bg-[hsl(var(--accent-secondary))]/20 transition-all"
                                                title="Ajustar Puntos"
                                            >
                                                <Coins size={18} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleBlock(user.id)}
                                                disabled={isPending || user.role === 'ADMIN'}
                                                title={user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                                                className={`p-2 rounded-lg transition-all ${user.isBlocked
                                                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                    } ${user.role === 'ADMIN' ? 'opacity-20 cursor-not-allowed' : ''}`}
                                            >
                                                {user.isBlocked ? <Shield size={18} /> : <ShieldOff size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-card w-full max-w-md p-8 border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">{isEditModalOpen ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                            <button onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleUpdateUser : handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-1">
                                    {isEditModalOpen ? 'Contraseña (dejar vacío para mantener)' : 'Contraseña'}
                                </label>
                                <input
                                    type="password"
                                    required={!isEditModalOpen}
                                    className="w-full px-4 py-2 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-1">Rol</label>
                                    <select
                                        className="w-full px-4 py-2 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all appearance-none"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-1">Puntos Iniciales</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-primary))] focus:outline-none transition-all"
                                        value={formData.points}
                                        onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3 mt-4 bg-[hsl(var(--accent-primary))] text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isEditModalOpen ? 'Guardar Cambios' : 'Crear Usuario'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Points Adjustment Modal */}
            {isPointsModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-card w-full max-w-sm p-8 border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold uppercase tracking-tighter">Ajustar Puntos</h2>
                                <p className="text-[10px] text-[hsl(var(--text-tertiary))] font-bold uppercase">{selectedUser?.name}</p>
                            </div>
                            <button onClick={() => setIsPointsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAdjustPoints} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-1">Cantidad (±)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 text-2xl font-black glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-secondary))] focus:outline-none transition-all text-center"
                                    value={pointsData.amount}
                                    onChange={(e) => setPointsData({ ...pointsData, amount: parseInt(e.target.value) })}
                                />
                                <p className="mt-2 text-[10px] text-center text-[hsl(var(--text-tertiary))]">Usa números negativos para restar puntos.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-[hsl(var(--text-tertiary))] mb-1">Motivo / Descripción</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2 glass-card border-white/10 rounded-xl focus:border-[hsl(var(--accent-secondary))] focus:outline-none transition-all min-h-[80px]"
                                    value={pointsData.description}
                                    onChange={(e) => setPointsData({ ...pointsData, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 mt-4 bg-[hsl(var(--accent-secondary))] text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-[hsl(var(--accent-secondary))]/20"
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                ACTUALIZAR PUNTOS
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

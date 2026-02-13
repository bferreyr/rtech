'use client'

import { registerUser } from "@/app/actions/auth"
import Link from "next/link"
import { Sparkles, ArrowRight, Mail, Lock, User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await registerUser(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            router.push("/profile")
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md space-y-8 glass-card p-10 border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-primary))]/5 to-transparent pointer-events-none" />

                <div className="text-center space-y-2 relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                        <Sparkles className="w-3 h-3 text-[hsl(var(--accent-primary))]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Unite a la elite</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter">Creá tu Cuenta</h1>
                    <p className="text-[hsl(var(--text-secondary))] text-sm">Disfrutá de beneficios exclusivos en RTECH</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--text-tertiary))] ml-1">Nombre Completo</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-tertiary))] group-focus-within:text-[hsl(var(--accent-primary))] transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-all"
                                    placeholder="Tu nombre"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--text-tertiary))] ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-tertiary))] group-focus-within:text-[hsl(var(--accent-primary))] transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--text-tertiary))] ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-tertiary))] group-focus-within:text-[hsl(var(--accent-primary))] transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--accent-primary))] transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest group disabled:opacity-50"
                    >
                        {loading ? "Registrando..." : "Crear Cuenta"}
                        {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="text-center pt-4 relative">
                    <p className="text-sm text-[hsl(var(--text-secondary))]">
                        ¿Ya tenés cuenta?{" "}
                        <Link href="/login" className="text-[hsl(var(--accent-primary))] font-bold hover:underline">
                            Iniciá Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

'use client';

import { Search, User, LogOut, LayoutDashboard, History, Coins, DollarSign } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CartTrigger } from '@/components/cart/CartTrigger';
import { SearchOverlay } from './SearchOverlay';
import { getUserPoints } from '@/app/actions/users';
import { useExchangeRate } from '@/hooks/useExchangeRate';

export function Navbar() {
    const { data: session } = useSession();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [livePoints, setLivePoints] = useState<number | null>(null);
    const { data: exchangeRateData, isLoading: isLoadingRate } = useExchangeRate(60000); // Update every minute

    useEffect(() => {
        if (session?.user?.id) {
            getUserPoints((session.user as any).id).then(setLivePoints);
        }
    }, [session?.user?.id, isUserMenuOpen]);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[hsl(var(--bg-primary))]/80">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile Menu Button - Left */}
                        <button
                            className="md:hidden p-2 -ml-2 text-[hsl(var(--text-secondary))]"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <LayoutDashboard size={24} />
                        </button>

                        {/* Logo - Centered on Mobile, Left on Desktop */}
                        <Link href="/" className="flex items-center space-x-2 group">
                            <span className="text-xl md:text-2xl font-black tracking-tighter gradient-text">RINCÓN TECH</span>
                        </Link>

                        {/* Navigation Links - Centered (Desktop) */}
                        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                            <Link href="/products" className="text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors">
                                Productos
                            </Link>
                            <Link href="/3d-printing" className="text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors">
                                Impresiones 3D
                            </Link>
                            <Link href="/electricista" className="text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[#f59e0b] transition-colors">
                                Electricidad
                            </Link>
                            <Link href="/pc-builder" className="text-sm font-medium text-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10 px-3 py-1.5 rounded-lg border border-[hsl(var(--accent-primary))]/20 hover:bg-[hsl(var(--accent-primary))]/20 transition-all">
                                Armado de PC
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-primary))] transition-colors">
                                Nosotros
                            </Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Dollar Rate Display - Compact */}
                            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                                <DollarSign size={12} className="text-green-500" />
                                {isLoadingRate ? (
                                    <span className="text-xs font-black text-green-500 animate-pulse">...</span>
                                ) : (
                                    <span className="text-xs font-black text-green-500">
                                        ${exchangeRateData?.rate.toFixed(0) || '---'}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <Search size={20} className="text-[hsl(var(--text-secondary))]" />
                            </button>

                            {/* Desktop User Menu */}
                            <div className="hidden md:block">
                                {session ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center text-[10px] font-bold text-white">
                                                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                                            </div>
                                        </button>

                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-[hsl(var(--bg-primary))] border border-white/10 rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
                                                <div className="px-3 py-2 border-b border-white/5 mb-2">
                                                    <p className="text-sm font-bold truncate">{session.user?.name || 'Usuario'}</p>
                                                    <p className="text-[10px] text-[hsl(var(--text-tertiary))] truncate">{session.user?.email}</p>
                                                </div>

                                                <div className="flex items-center gap-3 px-3 py-2 text-sm border-b border-white/5 mb-1 bg-gradient-to-r from-[hsl(var(--accent-secondary))]/5 to-transparent">
                                                    <Coins size={16} className="text-[hsl(var(--accent-secondary))]" />
                                                    <div>
                                                        <p className="text-[10px] text-[hsl(var(--text-tertiary))] uppercase font-black leading-none">Mis Puntos</p>
                                                        <p className="text-sm font-black text-[hsl(var(--accent-secondary))]">
                                                            {livePoints !== null ? livePoints : ((session.user as any).points || 0)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors group"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <History size={16} className="text-[hsl(var(--text-tertiary))] group-hover:text-[hsl(var(--accent-primary))]" />
                                                    Mis Pedidos
                                                </Link>

                                                {(session.user as any).role === 'ADMIN' && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors group"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <LayoutDashboard size={16} className="text-[hsl(var(--text-tertiary))] group-hover:text-[hsl(var(--accent-primary))]" />
                                                        Panel Admin
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={() => signOut()}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-500 transition-colors group text-left"
                                                >
                                                    <LogOut size={16} />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-sm font-bold text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
                                        >
                                            Ingresar
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="px-4 py-2 text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all"
                                        >
                                            Registrarse
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <CartTrigger />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] md:hidden">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-[hsl(var(--bg-primary))] border-r border-white/10 p-6 shadow-2xl animate-in slide-in-from-left duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xl font-black tracking-tighter gradient-text">MENU</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full"
                                >
                                    <LogOut size={20} className="rotate-180" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Navigation */}
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-[hsl(var(--text-tertiary))] uppercase tracking-wider">Navegación</p>
                                    <nav className="flex flex-col space-y-2">
                                        <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-white/5 font-medium">
                                            Productos
                                        </Link>
                                        <Link href="/3d-printing" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-white/5 font-medium">
                                            Impresiones 3D
                                        </Link>
                                        <Link href="/electricista" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-white/5 font-medium text-[#f59e0b]">
                                            Electricidad
                                        </Link>
                                        <Link href="/pc-builder" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-[hsl(var(--accent-primary))]/10 border border-[hsl(var(--accent-primary))]/20 font-medium text-[hsl(var(--accent-primary))]">
                                            Armado de PC
                                        </Link>
                                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-white/5 font-medium">
                                            Nosotros
                                        </Link>
                                    </nav>
                                </div>

                                {/* User Section */}
                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <p className="text-xs font-bold text-[hsl(var(--text-tertiary))] uppercase tracking-wider">Cuenta</p>

                                    {session ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center text-[10px] font-bold text-white">
                                                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold truncate">{session.user?.name}</p>
                                                    <p className="text-xs text-[hsl(var(--text-secondary))] truncate">{session.user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--accent-secondary))]/10 to-transparent border border-[hsl(var(--accent-secondary))]/20">
                                                <Coins size={16} className="text-[hsl(var(--accent-secondary))]" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-[hsl(var(--text-tertiary))] uppercase font-bold">Mis Puntos</p>
                                                    <p className="text-sm font-black text-[hsl(var(--accent-secondary))]">
                                                        {livePoints !== null ? livePoints : ((session.user as any).points || 0)}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5">
                                                <History size={18} />
                                                Mis Pedidos
                                            </Link>

                                            {(session.user as any).role === 'ADMIN' && (
                                                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5">
                                                    <LayoutDashboard size={18} />
                                                    Panel Admin
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                            >
                                                <LogOut size={18} />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-4 py-3 rounded-xl bg-white/5 font-bold">
                                                Ingresar
                                            </Link>
                                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-4 py-3 rounded-xl bg-[hsl(var(--accent-primary))] text-white font-bold">
                                                Registrarse
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}

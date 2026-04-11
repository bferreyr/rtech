'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Settings, Truck, Box, MessageSquare, Menu, X, Tag, Ticket, Megaphone, ShieldAlert } from 'lucide-react';
import { logoutUser } from '@/app/actions/auth';
import { useState } from 'react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'ELIT', href: '/admin/products' },
    { icon: Package, label: 'MOBE', href: '/admin/mobe/products' },
    { icon: Package, label: 'Cats', href: '/admin/categories' },
    { icon: ShoppingCart, label: 'Pedidos', href: '/admin/orders' },
    { icon: Truck, label: 'Envíos', href: '/admin/shipments' },
    { icon: Tag, label: 'Ofertas', href: '/admin/offers' },
    { icon: Ticket, label: 'Cupones', href: '/admin/coupons' },
    { icon: Megaphone, label: 'Anuncios', href: '/admin/announcements' },
    { icon: Users, label: 'Usuarios', href: '/admin/users' },
    { icon: MessageSquare, label: 'Reseñas', href: '/admin/reviews' },
    { icon: ShieldAlert, label: 'RMA', href: '/admin/warranty' },
    { icon: Box, label: '3D', href: '/admin/3d-printing' },
    { icon: Settings, label: 'Config', href: '/admin/settings' },
];

export function AdminNavbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-[hsl(var(--bg-secondary))] border-b border-white/10 sticky top-0 z-50">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/admin" className="text-xl font-bold tracking-tight gradient-text">
                            RTECH Admin
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white shadow-lg shadow-[hsl(var(--accent-glow))]'
                                            : 'text-[hsl(var(--text-secondary))] hover:bg-white/5 hover:text-[hsl(var(--text-primary))]'
                                            }`}
                                        title={item.label}
                                    >
                                        <Icon size={16} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Logout Button (Desktop) */}
                    <div className="hidden md:block">
                        <form action={logoutUser}>
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-950/30 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 text-sm font-medium">
                                <LogOut size={16} />
                                <span>Salir</span>
                            </button>
                        </form>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-[hsl(var(--text-secondary))] hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-[hsl(var(--bg-secondary))]">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${isActive
                                        ? 'bg-[hsl(var(--accent-primary))] text-white'
                                        : 'text-[hsl(var(--text-secondary))] hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                        <div className="pt-4 pb-2 border-t border-white/10 mt-2">
                            <form action={logoutUser}>
                                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-950/20">
                                    <LogOut size={20} />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

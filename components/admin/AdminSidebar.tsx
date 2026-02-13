'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Settings, Truck, Box, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { logoutUser } from '@/app/actions/auth';
import { useState, useEffect } from 'react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Productos ELIT', href: '/admin/products' },
    { icon: Package, label: 'Productos MOBE', href: '/admin/mobe/products' },
    { icon: Package, label: 'Categorías', href: '/admin/categories' },
    { icon: ShoppingCart, label: 'Pedidos', href: '/admin/orders' },
    { icon: Truck, label: 'Envíos', href: '/admin/shipments' },
    { icon: Users, label: 'Usuarios', href: '/admin/users' },
    { icon: Settings, label: 'Configuración', href: '/admin/settings' },
    { icon: MessageSquare, label: 'Reseñas', href: '/admin/reviews' },
    { icon: Box, label: 'Impresiones 3D', href: '/admin/3d-printing' },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Load collapsed state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        if (saved) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    // Save collapsed state to localStorage
    useEffect(() => {
        localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-[hsl(var(--bg-secondary))] to-[hsl(var(--bg-primary))] border-r border-white/10 flex flex-col h-screen sticky top-0 transition-all duration-300`}>
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                {!isCollapsed && (
                    <h2 className="text-xl font-bold tracking-tight gradient-text">RTECH Admin</h2>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto"
                    title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <div key={item.href} className="relative group">
                            <Link
                                href={item.href}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white shadow-lg shadow-[hsl(var(--accent-glow))]'
                                    : 'text-[hsl(var(--text-secondary))] hover:bg-white/5 hover:text-[hsl(var(--text-primary))] hover:border-white/20'
                                    }`}
                            >
                                <Icon size={20} />
                                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </Link>

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <span className="absolute left-full ml-2 px-3 py-2 bg-[hsl(var(--bg-secondary))] border border-white/10 rounded-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/10">
                <form action={logoutUser}>
                    <button className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-950/30 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200`}>
                        <LogOut size={20} />
                        {!isCollapsed && <span className="font-medium">Cerrar Sesión</span>}
                    </button>
                </form>
            </div>
        </aside>
    );
}

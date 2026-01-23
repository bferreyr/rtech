'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Settings, Truck } from 'lucide-react';
import { logoutUser } from '@/app/actions/auth';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Productos ELIT', href: '/admin/products' },
    { icon: Package, label: 'Productos MOBE', href: '/admin/mobe/products' },
    { icon: Package, label: 'Categorías', href: '/admin/categories' },
    { icon: ShoppingCart, label: 'Pedidos', href: '/admin/orders' },
    { icon: Truck, label: 'Envíos', href: '/admin/shipments' },
    { icon: Users, label: 'Usuarios', href: '/admin/users' },
    { icon: Settings, label: 'Configuración', href: '/admin/settings' },
    // { icon: Users, label: 'Clientes', href: '/admin/customers' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[color:var(--bg-secondary)] border-r border-[color:var(--border-color)] flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-[color:var(--border-color)]">
                <h2 className="text-xl font-bold tracking-tight">RTECH Admin</h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-[color:var(--accent-primary)] text-white'
                                : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-tertiary)] hover:text-[color:var(--text-primary)]'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[color:var(--border-color)]">
                <form action={logoutUser}>
                    <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-950/20 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}

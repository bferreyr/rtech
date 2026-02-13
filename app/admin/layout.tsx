import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[hsl(var(--bg-primary))] via-[hsl(var(--bg-secondary))] to-[hsl(var(--bg-primary))] text-[hsl(var(--text-primary))] font-sans">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="w-full mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

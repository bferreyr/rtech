import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[hsl(var(--bg-primary))] via-[hsl(var(--bg-secondary))] to-[hsl(var(--bg-primary))] text-[hsl(var(--text-primary))] font-sans">
            <AdminNavbar />
            <main className="flex-1 p-8">
                <div className="w-full mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

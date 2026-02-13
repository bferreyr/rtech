import { ReviewTable } from "@/components/admin/ReviewTable";
import { MessageSquare } from "lucide-react";

export default function AdminReviewsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Reseñas</h1>
                <p className="text-[color:var(--text-secondary)]">
                    Modera y responde a las opiniones de los clientes sobre tus productos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[color:var(--text-tertiary)] uppercase tracking-wider">Total Reseñas</p>
                            <h3 className="text-2xl font-bold">--</h3>
                        </div>
                    </div>
                </div>
                {/* Add more stats cards later when we have an endpoint for aggregate stats */}
            </div>

            <ReviewTable />
        </div>
    );
}

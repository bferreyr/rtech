interface AdminTableProps {
    children: React.ReactNode;
    className?: string;
}

export function AdminTable({ children, className = '' }: AdminTableProps) {
    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className={`w-full text-left text-sm ${className}`}>
                    {children}
                </table>
            </div>
        </div>
    );
}

export function AdminTableHeader({ children }: { children: React.ReactNode }) {
    return (
        <thead className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
            {children}
        </thead>
    );
}

export function AdminTableRow({ children, hover = true, className = '' }: { children: React.ReactNode; hover?: boolean; className?: string }) {
    return (
        <tr className={`border-b border-white/5 ${hover ? 'hover:bg-white/5 transition-colors' : ''} ${className}`}>
            {children}
        </tr>
    );
}

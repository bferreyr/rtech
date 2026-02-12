'use client';

interface AdminCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function AdminCard({ children, className = '', hover = true }: AdminCardProps) {
    return (
        <div className={`
            glass-card p-6 
            ${hover ? 'hover:border-white/20 hover:shadow-xl transition-all duration-300' : ''}
            ${className}
        `}>
            {children}
        </div>
    );
}

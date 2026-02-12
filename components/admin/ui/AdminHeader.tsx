interface AdminHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4 mb-8">
            <div>
                <h1 className="text-4xl font-bold gradient-text tracking-tight">{title}</h1>
                {description && (
                    <p className="text-[hsl(var(--text-secondary))] mt-2">{description}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
}

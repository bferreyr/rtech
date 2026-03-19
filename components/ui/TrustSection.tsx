'use client';

const TRUSTED_COMPANIES = [
    { name: 'Concejo Santa Fe', logo: '/confian/concejosantafe.svg' },
    { name: 'Nostalgia', logo: '/confian/nostalgia.png' },
];

export function TrustSection() {
    return (
        <section className="py-14 bg-[color:var(--bg-secondary)]/[0.3] border-y border-[color:var(--border-color)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight gradient-text">
                        Empresas que confían en nosotros
                    </h2>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
                    {TRUSTED_COMPANIES.map((company) => (
                        <div
                            key={company.name}
                            className="group relative flex flex-col items-center gap-3"
                        >
                            <div className="relative w-64 h-32 transition-all duration-500 transform group-hover:scale-105">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-full h-full object-contain brightness-0 invert opacity-60 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 transition-all duration-500 cursor-default"
                                />
                            </div>
                            {/* Subtle name label that appears on hover */}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {company.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

'use client';

const TRUSTED_COMPANIES = [
    { name: 'Concejo Santa Fe', logo: '/confian/concejosantafe.png' },
    { name: 'Nostalgia', logo: '/confian/nostalgia.png' },
];

export function TrustSection() {
    return (
        <section className="py-20 bg-[color:var(--bg-secondary)]/[0.3] border-y border-[color:var(--border-color)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[color:var(--text-tertiary)] mb-4">
                        Reconocimiento
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[color:var(--text-primary)] to-[color:var(--text-tertiary)] bg-clip-text text-transparent uppercase">
                        Empresas que confían en nosotros
                    </h3>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
                    {TRUSTED_COMPANIES.map((company) => (
                        <div
                            key={company.name}
                            className="group relative flex flex-col items-center gap-4"
                        >
                            <div className="relative w-48 h-24 transition-all duration-500 transform group-hover:scale-110">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-full h-full object-contain grayscale opacity-50 contrast-125 brightness-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500 cursor-default"
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

'use client';

const TOP_BRANDS = [
    { name: 'AMD', domain: 'amd.com' },
    { name: 'Intel', domain: 'intel.com' },
    { name: 'Nvidia', domain: 'nvidia.com' }, // Agregado aunque no salió en la lista, es clave en tech
    { name: 'Logitech', domain: 'logitech.com' },
    { name: 'Samsung', domain: 'samsung.com' },
    { name: 'MSI', domain: 'msi.com' },
    { name: 'Gigabyte', domain: 'gigabyte.com' },
    { name: 'Asus', domain: 'asus.com' },
    { name: 'Kingston', domain: 'kingston.com' },
    { name: 'HyperX', domain: 'hyperx.com' },
    { name: 'Lenovo', domain: 'lenovo.com' },
    { name: 'HP', domain: 'hp.com' },
    { name: 'Epson', domain: 'epson.com' },
    { name: 'WD', domain: 'westerndigital.com' },
    { name: 'Cooler Master', domain: 'coolermaster.com' },
    { name: 'Microsoft', domain: 'microsoft.com' },
];

export function BrandsCarousel() {
    return (
        <section className="py-12 bg-black/20 border-y border-white/5 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <h2 className="text-xl font-bold uppercase tracking-widest text-[color:var(--text-secondary)]">
                    Mejores Marcas
                </h2>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
                    {/* First Loop */}
                    {TOP_BRANDS.map((brand) => (
                        <div key={brand.name} className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-16 shrink-0">
                            <img
                                src={`https://logo.clearbit.com/${brand.domain}?size=128&format=png`}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {TOP_BRANDS.map((brand) => (
                        <div key={`${brand.name}-dup`} className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-16 shrink-0">
                            <img
                                src={`https://logo.clearbit.com/${brand.domain}?size=128&format=png`}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}

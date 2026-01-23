'use client';

// SimpleIcons slugs mapping where name differs
const TOP_BRANDS = [
    { name: 'AMD', slug: 'amd' },
    { name: 'Intel', slug: 'intel' },
    { name: 'Nvidia', slug: 'nvidia' },
    { name: 'Logitech', slug: 'logitech' },
    { name: 'Samsung', slug: 'samsung' },
    { name: 'MSI', slug: 'msi' },
    { name: 'Gigabyte', slug: 'gigabyte' },
    { name: 'Asus', slug: 'asus' },
    { name: 'Kingston', slug: 'kingstontechnology' }, // Kingston Technology
    { name: 'HyperX', slug: 'hyperx' }, // Check availability or use kingston fallback
    { name: 'Lenovo', slug: 'lenovo' },
    { name: 'HP', slug: 'hp' },
    { name: 'Epson', slug: 'epson' },
    { name: 'WD', slug: 'westerndigital' },
    { name: 'Cooler Master', slug: 'coolermaster' },
    { name: 'Microsoft', slug: 'microsoft' },
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
                        <a
                            key={brand.name}
                            href={`/products?search=${brand.name}`}
                            className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-16 shrink-0"
                        >
                            <img
                                src={`https://cdn.simpleicons.org/${brand.slug || brand.name.toLowerCase().replace(/ /g, '')}/white`}
                                alt={brand.name}
                                className="max-w-[70%] max-h-[70%] object-contain"
                                loading="lazy"
                            />
                        </a>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {TOP_BRANDS.map((brand) => (
                        <a
                            key={`${brand.name}-dup`}
                            href={`/products?search=${brand.name}`}
                            className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-16 shrink-0"
                        >
                            <img
                                src={`https://cdn.simpleicons.org/${brand.slug || brand.name.toLowerCase().replace(/ /g, '')}/white`}
                                alt={brand.name}
                                className="max-w-[70%] max-h-[70%] object-contain"
                                loading="lazy"
                            />
                        </a>
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

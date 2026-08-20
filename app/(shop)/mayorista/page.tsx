import type { Metadata } from 'next';
import ExtranetEmbed from './_components/ExtranetEmbed';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Mayorista | Rincón TECH',
    description: 'Sistema Mayorista Rincón TECH.',
    robots: { index: false, follow: false },
};

export default function ExtranetPage() {
    return (
        <div className="w-full min-h-screen bg-white">
            <ExtranetEmbed />
        </div>
    );
}

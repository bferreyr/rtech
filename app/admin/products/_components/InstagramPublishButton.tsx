'use client';

import { useState } from 'react';
import { Instagram, Loader2, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { publishToInstagram } from '@/app/actions/instagram';

interface Props {
    productId: string;
    productName: string;
}

export function InstagramPublishButton({ productId, productName }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async (type: 'FEED' | 'STORY' | 'BOTH') => {
        if (!confirm(`¿Estás seguro de publicar "${productName}" en ${type}?`)) return;
        
        setIsPublishing(true);
        try {
            const res = await publishToInstagram(productId, type);
            if (res.success) {
                alert(res.message);
                setIsOpen(false);
            } else {
                alert(`Error: ${res.error}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:text-pink-500 transition-colors relative group"
                title="Publicar en Instagram"
                disabled={isPublishing}
            >
                {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Instagram size={18} />}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl shadow-lg bg-[#0f172a] border border-white/10 ring-1 ring-black ring-opacity-5 z-20 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                        <div className="py-1">
                            <button
                                onClick={() => handlePublish('FEED')}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors text-white"
                            >
                                <LayoutGrid size={16} className="text-white/70" />
                                <span>Publicar en Feed</span>
                            </button>
                            <button
                                onClick={() => handlePublish('STORY')}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors text-white"
                            >
                                <ImageIcon size={16} className="text-white/70" />
                                <span>Publicar Historia</span>
                            </button>
                            <div className="border-t border-white/10 my-1"></div>
                            <button
                                onClick={() => handlePublish('BOTH')}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors font-bold text-pink-500"
                            >
                                <Instagram size={16} />
                                <span>Publicar en Ambos</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

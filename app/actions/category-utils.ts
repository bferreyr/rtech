import { prisma } from "@/lib/prisma";

const globalCategoryCache = new Map<string, string>(); // slug -> id

// Fix encoding corrupto tipo "CÃ¡mara" → "Cámara"
export const fixEncoding = (str: string | null | undefined): string => {
    if (!str) return '';
    try {
        const bytes = new Uint8Array(str.split('').map(c => c.charCodeAt(0) & 0xff));
        const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        return decoded.trim();
    } catch {
        return str.trim();
    }
};

export const resolveCategory = async (name: string, parentId: string | null = null): Promise<string | null> => {
    const slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/ /g, '-').replace(/[^\w-]+/g, '');

    if (globalCategoryCache.has(slug)) return globalCategoryCache.get(slug)!;

    let category = await prisma.category.findUnique({ where: { slug } });

    if (!category) {
        try {
            category = await prisma.category.create({
                data: {
                    name: fixEncoding(name.trim()),
                    slug,
                    parentId
                }
            });
        } catch (e) {
            category = await prisma.category.findUnique({ where: { slug } });
        }
    } else {
        if (parentId && !category.parentId) {
            await prisma.category.update({
                where: { id: category.id },
                data: { parentId }
            });
        }
    }

    if (category) {
        globalCategoryCache.set(slug, category.id);
        return category.id;
    }
    return null;
};

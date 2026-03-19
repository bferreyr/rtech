import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

function fixString(str: string | null) {
    if (!str) return str;
    let s = str;

    // Minúsculas con tilde — doble-encoding UTF-8 en Latin-1
    s = s.replace(/Ã¡/g, 'á');
    s = s.replace(/Ã©/g, 'é');
    s = s.replace(/Ã­/g, 'í');
    s = s.replace(/Ã³/g, 'ó');
    s = s.replace(/Ãº/g, 'ú');
    s = s.replace(/Ã¼/g, 'ü');
    s = s.replace(/Ã±/g, 'ñ');

    // Mayúsculas con tilde
    s = s.replace(/Ã\u0081/g, 'Á');
    s = s.replace(/Ã\u0089/g, 'É');
    s = s.replace(/Ã\u008D/g, 'Í');
    s = s.replace(/Ã\u0093/g, 'Ó');
    s = s.replace(/Ã\u009A/g, 'Ú');
    s = s.replace(/Ã\u0091/g, 'Ñ');

    // Variantes alternativas comunes
    s = s.replace(/Ã‰/g, 'É');
    s = s.replace(/Ã"/g, 'Ó');
    s = s.replace(/Ãš/g, 'Ú');
    s = s.replace(/Ã'/g, 'Ñ');
    s = s.replace(/ÃÑ/g, 'Ñ');

    // Caracteres especiales
    s = s.replace(/â€œ/g, '"');
    s = s.replace(/â€/g, '"');
    s = s.replace(/â€˜/g, "'");
    s = s.replace(/â€™/g, "'");
    s = s.replace(/â€"/g, '–');
    s = s.replace(/Â°/g, '°');
    s = s.replace(/Â·/g, '·');
    s = s.replace(/Â³/g, '³');
    s = s.replace(/Â²/g, '²');

    return s;
}

export async function GET() {
    const log: string[] = [];

    // 1. Categorías
    const categories = await prisma.category.findMany({
        where: {
            OR: [
                { name: { contains: 'Ã' } },
                { name: { contains: 'Â' } },
            ]
        }
    });

    let catFixed = 0;
    for (const cat of categories) {
        const fixedName = fixString(cat.name);
        if (fixedName !== cat.name) {
            await prisma.category.update({
                where: { id: cat.id },
                data: { name: fixedName || cat.name }
            });
            catFixed++;
        }
    }
    log.push(`Categorías corregidas: ${catFixed}`);

    // 2. Productos
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'Ã' } },
                { name: { contains: 'Â' } },
                { description: { contains: 'Ã' } },
                { description: { contains: 'Â' } },
                { marca: { contains: 'Ã' } },
                { marca: { contains: 'Â' } },
                { categoria: { contains: 'Ã' } },
                { categoria: { contains: 'Â' } },
            ]
        }
    });

    let prodFixed = 0;
    for (const prod of products) {
        const fixedName = fixString(prod.name);
        const fixedDesc = fixString(prod.description);
        const fixedMarca = fixString(prod.marca);
        const fixedCat = fixString(prod.categoria);

        const hasChanges =
            fixedName !== prod.name ||
            fixedDesc !== prod.description ||
            fixedMarca !== prod.marca ||
            fixedCat !== prod.categoria;

        if (hasChanges) {
            await prisma.product.update({
                where: { id: prod.id },
                data: {
                    name: fixedName || prod.name,
                    description: fixedDesc || prod.description,
                    marca: fixedMarca,
                    categoria: fixedCat,
                }
            });
            prodFixed++;
        }
    }
    log.push(`Productos corregidos: ${prodFixed}`);

    return NextResponse.json({ success: true, log, total: { categorias: catFixed, productos: prodFixed } });
}

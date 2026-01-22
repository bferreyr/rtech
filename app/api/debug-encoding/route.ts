import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    // Buscar productos con caracteres sospechosos comunes de UTF-8 mal decodificado (Ã)
    // Prisma no tiene regex nativo fácil en SQLite/Postgres abstracto sin raw, pero usaremos contains simple.
    // 'Ã' es el primer byte común de vocales con tilde en UTF-8 (C3).

    // @ts-ignore
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'Ã' } },
                { description: { contains: 'Ã' } }
            ]
        },
        select: { id: true, name: true, categoryId: true },
        take: 100
    });

    // @ts-ignore
    const categories = await prisma.category.findMany({
        where: {
            name: { contains: 'Ã' }
        },
        select: { id: true, name: true }
    });

    return NextResponse.json({
        countProducts: products.length,
        countCategories: categories.length,
        sampleProducts: products.slice(0, 10),
        sampleCategories: categories
    });
}

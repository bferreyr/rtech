import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    // @ts-ignore
    const mobos = await prisma.product.findMany({
        where: { category: { slug: 'motherboards' } },
        take: 50,
        select: { name: true, category: { select: { slug: true } } }
    });
    // @ts-ignore
    const cpus = await prisma.product.findMany({
        where: { category: { slug: 'procesadores' } },
        take: 50,
        select: { name: true, category: { select: { slug: true } } }
    });

    return NextResponse.json({ mobos, cpus });
}

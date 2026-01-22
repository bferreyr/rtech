import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

function fixString(str: string | null) {
    if (!str) return str;
    let newStr = str;

    // Common UTF-8 mismatch patterns
    newStr = newStr.replace(/Ã¡/g, 'á');
    newStr = newStr.replace(/Ã©/g, 'é');
    newStr = newStr.replace(/Ã³/g, 'ó');
    newStr = newStr.replace(/Ãº/g, 'ú');
    newStr = newStr.replace(/Ã±/g, 'ñ');
    newStr = newStr.replace(/ÃÑ/g, 'ñ');
    newStr = newStr.replace(/Ã\u00AD/g, 'í'); // Soft hyphen case for í
    newStr = newStr.replace(/Ã­/g, 'í'); // Literal copy-paste from debug output just in case
    newStr = newStr.replace(/Ã/g, 'Í'); // Generic leftover Ã often matches Í or í cases if previous didn't catch, but risky. Let's stick to knowns first.

    // Uppercase cases
    newStr = newStr.replace(/Ã/g, 'Á');
    newStr = newStr.replace(/Ã‰/g, 'É');
    newStr = newStr.replace(/Ã“/g, 'Ó');
    newStr = newStr.replace(/Ãš/g, 'Ú');
    newStr = newStr.replace(/Ã‘/g, 'Ñ');

    return newStr;
}

export async function GET() {
    const log = [];

    // 1. Categories
    // @ts-ignore
    const categories = await prisma.category.findMany({
        where: { name: { contains: 'Ã' } }
    });

    let catFixed = 0;
    for (const cat of categories) {
        const fixedName = fixString(cat.name);
        if (fixedName !== cat.name) {
            // @ts-ignore
            await prisma.category.update({
                where: { id: cat.id },
                data: { name: fixedName }
            });
            catFixed++;
        }
    }
    log.push(`Categories fixed: ${catFixed}`);

    // 2. Products
    // @ts-ignore
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'Ã' } },
                { description: { contains: 'Ã' } }
            ]
        }
    });

    let prodFixed = 0;
    for (const prod of products) {
        const fixedName = fixString(prod.name);
        const fixedDesc = fixString(prod.description);

        if (fixedName !== prod.name || fixedDesc !== prod.description) {
            // @ts-ignore
            await prisma.product.update({
                where: { id: prod.id },
                data: {
                    name: fixedName,
                    description: fixedDesc
                }
            });
            prodFixed++;
        }
    }
    log.push(`Products fixed: ${prodFixed}`);

    return NextResponse.json({ success: true, log });
}

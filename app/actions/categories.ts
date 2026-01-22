'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getExchangeRate, getGlobalMarkup } from "@/app/actions/settings";

export async function getCategories() {
    try {
        // @ts-ignore - Fallback if client generation is lagging
        return await prisma.category.findMany({
            where: {
                // @ts-ignore
                parentId: null
            },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                },
                // @ts-ignore
                children: {
                    orderBy: { name: 'asc' }
                }
            }
        });
    } catch (e) {
        console.error('Prisma client out of sync, using raw fallback for categories');
        // Raw query as last resort if model doesn't exist in client yet
        return await prisma.$queryRaw`SELECT id, name, slug FROM Category ORDER BY name ASC` as any[];
    }
}

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // @ts-ignore
    await prisma.category.create({
        data: { name, slug }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // @ts-ignore
    await prisma.category.update({
        where: { id },
        data: { name, slug }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
    // @ts-ignore
    await prisma.category.delete({
        where: { id }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
}

export async function getProducts(options?: {
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name_asc',
    page?: number,
    limit?: number,
    search?: string
}) {
    const { categoryId, minPrice, maxPrice, sortBy, page = 1, limit = 12, search } = options || {};

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (search) {
        where.OR = [
            { name: { contains: search } }, // SQLite is case-sensitive by default with contains unless configured, but for now this is standard
            { description: { contains: search } }
        ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'name_asc') orderBy = { name: 'asc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            orderBy,
            skip,
            take: limit
        })
    ]);

    // Fetch global settings for runtime markup application
    const [rateData, globalMarkup] = await Promise.all([
        getExchangeRate(),
        getGlobalMarkup()
    ]);
    const exchangeRate = rateData.rate;

    const totalPages = Math.ceil(total / limit);

    const serializedProducts = (products as any[]).map(p => {
        // Runtime Price Calculation
        // 1. Identify Base Cost (prefer 'precio', fallback to 'price')
        const baseCost = p.precio ? Number(p.precio) : Number(p.price);

        // 2. Apply Global Markup
        const markupMultiplier = 1 + (globalMarkup / 100);
        const finalPvpUsd = baseCost * markupMultiplier;

        // 3. Calculate ARS
        const finalPvpArs = finalPvpUsd * exchangeRate;

        return {
            ...p,
            // Convert all Decimal fields to numbers for Client Component serialization
            // OVERRIDE price with calculated markup price for Frontend Display
            price: Number(finalPvpUsd.toFixed(2)),

            // Keep original cost accessible if needed (though usually internal)
            precio: Number(baseCost),

            impuestoInterno: p.impuestoInterno ? Number(p.impuestoInterno) : null,
            iva: p.iva ? Number(p.iva) : null,
            markup: globalMarkup, // Show the markup being applied
            cotizacion: exchangeRate,

            pvpUsd: Number(finalPvpUsd.toFixed(2)),
            pvpArs: Number(finalPvpArs.toFixed(2)),

            peso: p.peso ? Number(p.peso) : null,
            weight: p.weight ? Number(p.weight) : null,
        };
    });

    return {
        products: serializedProducts,
        pagination: {
            total,
            totalPages,
            currentPage: page,
            limit
        }
    };
}

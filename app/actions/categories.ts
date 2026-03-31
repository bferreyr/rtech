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

export async function deleteAllCategories() {
    // @ts-ignore
    await prisma.category.deleteMany({});

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
}

export async function getProducts(options?: {
    categoryId?: string,
    brands?: string[], // NEW: Multiple brand filter
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean, // NEW: Toggle for stock availability
    sortBy?: 'random' | 'price_asc' | 'price_desc' | 'newest' | 'name_asc',
    page?: number,
    limit?: number,
    search?: string
}) {
    const { categoryId, brands, minPrice, maxPrice, inStock, sortBy, page = 1, limit = 12, search } = options || {};

    const where: any = {};

    // Category filter
    if (categoryId) where.categoryId = categoryId;

    // Brand filter (multiple selection)
    if (brands && brands.length > 0) {
        where.marca = { in: brands };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Search filter (case-insensitive)
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { marca: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } }
        ];
    }

    // Stock filter - ALWAYS filter out products with no stock
    where.stock = { gt: 0 };


    let orderBy: any = {};
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    else if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    else if (sortBy === 'name_asc') orderBy = { name: 'asc' };
    else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    let finalProducts;
    let total;

    if (sortBy === 'random' || !sortBy) {
        // Ordenamiento pseudo-aleatorio basado en ventana de tiempo para que la paginación no se rompa
        // La semilla cambia cada 15 minutos, garantizando productos mezclados pero paginación estable en sesión corta
        const seed = Math.floor(Date.now() / (1000 * 60 * 15));
        
        const hashString = (str: string, seed: number) => {
            let h = seed;
            for(let i = 0; i < str.length; i++)
                h = Math.imul(31, h) + str.charCodeAt(i) | 0;
            return h;
        };

        const [count, allProducts] = await Promise.all([
            prisma.product.count({ where }),
            prisma.product.findMany({ where })
        ]);
        
        total = count;
        
        // Mezclamos consistentemente con el hash
        const shuffled = allProducts.sort((a, b) => hashString(a.id, seed) - hashString(b.id, seed));
        
        finalProducts = shuffled.slice(skip, skip + limit);
    } else {
        const [count, products] = await Promise.all([
            prisma.product.count({ where }),
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit
            })
        ]);
        total = count;
        finalProducts = products;
    }

    // Fetch global settings for runtime markup application
    const [rateData, globalMarkup] = await Promise.all([
        getExchangeRate(),
        getGlobalMarkup()
    ]);
    const exchangeRate = rateData.rate;

    const totalPages = Math.ceil(total / limit);

    const serializedProducts = (finalProducts as any[]).map(p => {
        // Runtime Price Calculation
        // 1. Identify Base Cost (prefer 'pvpUsd', then 'precio', fallback to 'price')
        const baseCost = p.pvpUsd ? Number(p.pvpUsd) : (p.precio ? Number(p.precio) : Number(p.price));

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

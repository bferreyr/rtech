'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

    const totalPages = Math.ceil(total / limit);

    const serializedProducts = (products as any[]).map(p => ({
        ...p,
        // Convert all Decimal fields to numbers for Client Component serialization
        price: p.pvpUsd ? Number(p.pvpUsd) : Number(p.price),
        precio: p.precio ? Number(p.precio) : null,
        impuestoInterno: p.impuestoInterno ? Number(p.impuestoInterno) : null,
        iva: p.iva ? Number(p.iva) : null,
        markup: p.markup ? Number(p.markup) : null,
        cotizacion: p.cotizacion ? Number(p.cotizacion) : null,
        pvpUsd: p.pvpUsd ? Number(p.pvpUsd) : null,
        pvpArs: p.pvpArs ? Number(p.pvpArs) : null,
        peso: p.peso ? Number(p.peso) : null,
        weight: p.weight ? Number(p.weight) : null,
    }));

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

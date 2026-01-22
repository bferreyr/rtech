'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as XLSX from 'xlsx';

export async function createProduct(formData: FormData) {
    const sku = formData.get('sku') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const categoryId = formData.get('categoryId') as string || null;

    await prisma.product.create({
        data: {
            sku,
            name,
            description,
            price,
            stock,
            imageUrl,
            categoryId,
            // Sync new fields with legacy values
            // @ts-ignore
            precio: price,
            stockTotal: stock,
            imagen: imageUrl,
            codigoProducto: sku,
        }
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/'); // Home page featured
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const sku = formData.get('sku') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const categoryId = formData.get('categoryId') as string || null;

    await prisma.product.update({
        where: { id },
        data: {
            sku,
            name,
            description,
            price,
            stock,
            imageUrl,
            categoryId,
            // Sync new fields with legacy values
            // @ts-ignore
            precio: price,
            stockTotal: stock,
            imagen: imageUrl,
            codigoProducto: sku,
        }
    });

    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/admin/products');
    revalidatePath('/products');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
}

export async function deleteProducts(ids: string[]) {
    if (!ids || ids.length === 0) return { success: false, error: "No IDs provided" };

    try {
        await prisma.product.deleteMany({
            where: { id: { in: ids } }
        });

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };
    } catch (error) {
        console.error("Error deleting products:", error);
        return { success: false, error: "Failed to delete products" };
    }
}

export async function deleteAllProducts() {
    try {
        // Delete all products
        await prisma.product.deleteMany({});

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };
    } catch (error) {
        console.error("Error deleting all products:", error);
        return { success: false, error: "Failed to delete all products" };
    }
}

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query } },
                { description: { contains: query } }
            ]
        },
        take: 8,
        orderBy: { name: 'asc' }
    });

    return products.map(serializeProduct);
}

export async function getFullSearchResults(query: string) {
    if (!query) return [];

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query } },
                { description: { contains: query } }
            ]
        },
        orderBy: { name: 'asc' }
    });

    return products.map(serializeProduct);
}

function serializeProduct(p: any) {
    return {
        ...p,
        price: p.pvpUsd ? Number(p.pvpUsd) : Number(p.price),
        precio: Number(p.precio),
        peso: p.peso ? Number(p.peso) : null,
        weight: p.weight ? Number(p.weight) : null,
        impuestoInterno: p.impuestoInterno ? Number(p.impuestoInterno) : null,
        iva: p.iva ? Number(p.iva) : null,
        markup: p.markup ? Number(p.markup) : null,
        cotizacion: p.cotizacion ? Number(p.cotizacion) : null,
        pvpUsd: p.pvpUsd ? Number(p.pvpUsd) : null,
        pvpArs: p.pvpArs ? Number(p.pvpArs) : null,
    };
}

export async function getAdminProducts(options?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
}) {
    const { page = 1, limit = 50, search, categoryId } = options || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search } },
            { description: { contains: search } },
            { sku: { contains: search } },
            { marca: { contains: search } }
        ];
    }

    if (categoryId && categoryId !== 'all') {
        where.categoryId = categoryId;
    }

    const [total, products] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: { category: true }
        })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        products: products.map(serializeProduct),
        pagination: {
            total,
            totalPages,
            currentPage: page,
            limit
        }
    };
}

import { getExchangeRate, getGlobalMarkup } from "@/app/actions/settings";

// ... existing imports

export async function bulkUploadProducts(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No se subió ningún archivo');

    // Fetch global settings once
    const [rateData, globalMarkup] = await Promise.all([
        getExchangeRate(),
        getGlobalMarkup()
    ]);

    const exchangeRate = rateData.rate;
    console.log(`Starting bulk upload. Rate: ${exchangeRate}, Markup: ${globalMarkup}%`);

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    // Cache to minimize DB queries during loop
    const categoryCache = new Map<string, string>(); // slug -> id

    const resolveCategory = async (name: string, parentId: string | null = null) => {
        // ... (keep existing category logic)
        const slug = name.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/ /g, '-').replace(/[^\w-]+/g, '');

        if (categoryCache.has(slug)) return categoryCache.get(slug)!;

        // Try strict find first
        let category = await prisma.category.findUnique({ where: { slug } });

        if (!category) {
            try {
                // @ts-ignore
                category = await prisma.category.create({
                    data: {
                        name: name.trim(),
                        slug,
                        // @ts-ignore
                        parentId
                    }
                });
            } catch (e) {
                // Race condition fallback
                category = await prisma.category.findUnique({ where: { slug } });
            }
        } else {
            // If category exists and we are explicitly setting a parent (and it currently has none)
            // we update it. This helps build hierarchy incrementally.
            // @ts-ignore
            if (parentId && !category.parentId) {
                // @ts-ignore
                await prisma.category.update({
                    where: { id: category.id },
                    // @ts-ignore
                    data: { parentId }
                });
            }
        }

        if (category) {
            categoryCache.set(slug, category.id);
            return category.id;
        }
        return null;
    };

    for (const row of data) {
        // Skip rows without essential data
        if (!row.codigo_producto && !row.sku && !row.nombre && !row.name) continue;

        let categoryId = null;

        // 1. Handle Main Category
        const catName = row.categoria || row.category || row.Categoria;
        if (catName && typeof catName === 'string') {
            const parentId = await resolveCategory(catName);

            if (parentId) {
                categoryId = parentId; // Default to parent

                // 2. Handle Subcategory (if exists)
                const subCatName = row.sub_categoria || row.subcategory || row.SubCategoria || row.subCategoria;
                if (subCatName && typeof subCatName === 'string') {
                    // Create/Find subcategory with parentId
                    const subId = await resolveCategory(subCatName, parentId);
                    if (subId) categoryId = subId; // Link to subcategory instead
                }
            }
        }

        const productData = {
            // Product Identification
            sku: String(row.codigo_producto || row.sku || `PROD-${Date.now()}`),
            codigoAlfa: row.codigo_alfa ? String(row.codigo_alfa) : null,
            codigoProducto: row.codigo_producto ? String(row.codigo_producto) : null,

            // Basic Information
            name: String(row.nombre || row.name || ''),
            description: String(row.description || ''),
            categoria: row.categoria ? String(row.categoria) : null,
            subCategoria: row.sub_categoria ? String(row.sub_categoria) : null,
            marca: row.marca ? String(row.marca) : null,

            categoryId: categoryId || null, // Link to resolved Category (Parent or Sub)

            // Pricing & Taxes
            precio: parseFloat(String(row.precio || row.price || 0)),
            impuestoInterno: row.impuesto_interno ? parseFloat(String(row.impuesto_interno)) : null,
            iva: row.iva ? parseFloat(String(row.iva)) : null,
            moneda: row.moneda ? String(row.moneda) : 'USD',

            // Dynamic Calculation
            markup: globalMarkup, // Store the markup used at this time
            cotizacion: exchangeRate, // Store the rate used at this time

            // Logic: Cost * (1 + markup/100)
            pvpUsd: parseFloat(String((parseFloat(String(row.precio || row.price || 0)) * (1 + globalMarkup / 100)).toFixed(2))),

            // Logic: pvpUsd * exchangeRate
            pvpArs: parseFloat(String(((parseFloat(String(row.precio || row.price || 0)) * (1 + globalMarkup / 100)) * exchangeRate).toFixed(2))),

            // Physical Properties
            peso: row.peso ? parseFloat(String(row.peso)) : null,
            ean: row.ean ? String(row.ean) : null,

            // Stock Management
            nivelStock: row.nivel_stock ? String(row.nivel_stock) : null,
            stockTotal: parseInt(String(row.stock_total || row.stock || 0)),
            stockDepositoCliente: row.stock_deposito_cliente ? parseInt(String(row.stock_deposito_cliente)) : 0,
            stockDepositoCd: row.stock_deposito_cd ? parseInt(String(row.stock_deposito_cd)) : 0,

            // Additional Info
            garantia: row.garantia ? String(row.garantia) : null,
            link: row.link ? String(row.link) : null,

            // Media
            imagen: row.imagen ? String(row.imagen) : null,
            miniatura: row.miniatura ? String(row.miniatura) : null,

            // Attributes & Flags
            atributos: row.atributos ? String(row.atributos) : null,
            gamer: row.gamer === true || row.gamer === 'true' || row.gamer === 1 || row.gamer === '1',

            // Legacy fields for backward compatibility
            price: parseFloat(String((parseFloat(String(row.precio || row.price || 0)) * (1 + globalMarkup / 100)).toFixed(2))), // Now reflects pvpUsd
            stock: parseInt(String(row.stock_total || row.stock || 0)),
            imageUrl: row.imagen || row.imageUrl || null,
            weight: row.peso ? parseFloat(String(row.peso)) : null,
        };

        await prisma.product.upsert({
            where: { sku: productData.sku },
            update: productData,
            create: productData
        });
    }

    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/products');
    revalidatePath('/');
}

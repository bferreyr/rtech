'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as XLSX from 'xlsx';
import { auth } from "@/auth";

export async function createProduct(formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

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
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

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
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        return { success: false, error: "No autorizado" };
    }

    try {
        await prisma.product.delete({
            where: { id }
        });

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting product:", error);
        return { success: false, error: error.message || "Failed to delete product" };
    }
}

export async function deleteProducts(ids: string[]) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        return { success: false, error: "No autorizado" };
    }

    if (!ids || ids.length === 0) return { success: false, error: "No IDs provided" };

    try {
        await prisma.product.deleteMany({
            where: { id: { in: ids } }
        });

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting products:", error);
        return { success: false, error: error.message || "Failed to delete products" };
    }
}

export async function deleteAllProducts(provider?: string) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        return { success: false, error: "No autorizado" };
    }

    try {
        const where = provider ? { provider } : {};
        // Delete all products for specific provider
        // @ts-ignore
        await prisma.product.deleteMany({ where });

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting all products:", error);
        // Check for common Prisma errors
        if (error.code === 'P2003') {
            return { success: false, error: "No se pueden eliminar productos que tienen pedidos o datos asociados." };
        }
        return { success: false, error: error.message || "Failed to delete all products" };
    }
}

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { marca: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } }
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
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { marca: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } }
            ]
        },
        orderBy: { name: 'asc' }
    });

    return products.map(serializeProduct);
}

// New: Get available filters for the current product set
export async function getAvailableFilters(categoryId?: string) {
    const where: any = categoryId ? { categoryId } : {};

    const [brands, priceRange, categories] = await Promise.all([
        // Get unique brands with product count
        prisma.product.groupBy({
            by: ['marca'],
            where: { ...where, marca: { not: null } },
            _count: { marca: true },
            orderBy: { _count: { marca: 'desc' } },
        }),

        // Get price range
        prisma.product.aggregate({
            where,
            _min: { price: true },
            _max: { price: true },
        }),

        // Get categories with product count
        prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: 'asc' },
        }),
    ]);

    return {
        brands: brands
            .filter(b => b.marca)
            .map(b => ({
                name: b.marca!,
                count: b._count.marca,
            })),
        priceRange: {
            min: priceRange._min.price ? Number(priceRange._min.price) : 0,
            max: priceRange._max.price ? Number(priceRange._max.price) : 1000,
        },
        categories: categories.map(c => ({
            ...c,
            productCount: c._count.products,
        })),
    };
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



export async function getFeaturedProducts() {
    // 1. Get total count of eligible products
    const count = await prisma.product.count({
        where: {
            stockTotal: { gt: 0 },
            price: { gt: 250 },
            imageUrl: { not: null }
        }
    });

    if (count === 0) return [];

    // 2. Determine a random skip value
    // We want to fetch a random subset. Since Prisma doesn't support RAND() natively and efficiently across DBs,
    // we'll fetch a larger pool from a random offset if safe, or just fetch more ids.

    // Better strategy for "Offers":
    // Fetch a pool of IDs first (lightweight), shuffle them, then fetch full details for X amount.
    const products = await prisma.product.findMany({
        where: {
            stockTotal: { gt: 0 },
            price: { gt: 250 },
            imageUrl: { not: null }
        },
        select: { id: true }, // Only fetch IDs
        take: 100, // Look at up to 100 potential offers
        orderBy: { updatedAt: 'desc' } // Still prefer somewhat recent, but pool is larger
    });

    // Shuffle the IDs
    const shuffledIds = products.sort(() => 0.5 - Math.random()).slice(0, 8); // Take 8 random IDs

    // Fetch details for these IDs
    const randomProducts = await prisma.product.findMany({
        where: {
            id: { in: shuffledIds.map(p => p.id) }
        }
    });

    return randomProducts.map(serializeProduct);
}

export async function getAdminProducts({
    page = 1,
    limit = 10,
    search = '',
    categoryId = '',
    provider = ''
}: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    provider?: string;
}) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
            { marca: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    // Filter by provider if specified (ELIT / MOBE)
    if (provider) {
        where.provider = provider;
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { updatedAt: 'desc' },
            include: { category: true }
        }),
        prisma.product.count({ where })
    ]);

    return {
        products: products.map(serializeProduct),
        pagination: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit
        }
    };
}

// ... existing imports

export async function bulkUploadProducts(formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    const file = formData.get('file') as File;
    const provider = (formData.get('provider') as string) || 'ELIT';

    if (!file) throw new Error('No se subió ningún archivo');

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    // Helper to fix common encoding issues (Double UTF-8 or Latin1 viewed as UTF-8)
    // Helper to fix common encoding issues 
    // MODIFIED: Simply returning the string as is. The previous logic was breaking valid UTF-8 strings
    // from standard Excel files by re-interpreting them, causing "Código" -> "Cdigo".
    const fixEncoding = (str: string | null | undefined): string => {
        if (!str) return '';
        return str.trim();
    };

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
                        name: fixEncoding(name.trim()),
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

    // Process in batches to avoid timeouts and improve performance
    // Reduced batch size to preventing timeouts and memory issues
    const BATCH_SIZE = 20;
    const chunks = [];

    // Split data into chunks
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        chunks.push(data.slice(i, i + BATCH_SIZE));
    }

    console.log(`Processing ${data.length} products in ${chunks.length} batches...`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let index = 0; index < chunks.length; index++) {
        const chunk = chunks[index];
        console.log(`Processing batch ${index + 1}/${chunks.length}`);

        // process batch
        const results = await Promise.all(chunk.map(async (row: any) => {
            try {
                // Dictionary of Excel keys to normalize access
                // "Cód." -> row['Cód.']
                const getVal = (keys: string[]) => {
                    for (const key of keys) {
                        if (row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key];
                    }
                    return null;
                };

                // Essential fields check
                const sku = getVal(['Cód.', 'Cód', 'codigo_producto', 'sku', 'SKU']);
                const name = getVal(['Descripción', 'Descripcion', 'nombre', 'name', 'Name']);

                if (!sku && !name) return { status: 'skipped' };

                let categoryId = null;

                // 1. Handle Main Category
                const catName = getVal(['Rubro', 'categoria', 'category', 'Categoria']);
                if (catName && typeof catName === 'string') {
                    const parentId = await resolveCategory(catName);

                    if (parentId) {
                        categoryId = parentId; // Default to parent

                        // 2. Handle Subcategory (if exists)
                        const subCatName = getVal(['SubRubro', 'sub_categoria', 'subcategory', 'SubCategoria']);
                        if (subCatName && typeof subCatName === 'string') {
                            // Create/Find subcategory with parentId
                            const subId = await resolveCategory(subCatName, parentId);
                            if (subId) categoryId = subId; // Link to subcategory instead
                        }
                    }
                }

                // Helper for number parsing (handles "1.200,50" and "1200.50")
                const parseNum = (val: any): number | null => {
                    if (val === undefined || val === null || val === '') return null;
                    if (typeof val === 'number') return val;
                    const str = String(val).trim();
                    // If contains comma and dot, assume comma is decimal if it comes last? 
                    // Or standard Argentine format: dot=thousands, comma=decimal
                    // Simple heuristic: replace comma with dot if dot is not present?
                    // Better: remove dots, replace comma with dot
                    // "1.200,50" -> "1200.50"
                    // "1200.50" -> "1200.50"
                    // "1,200.50" -> "1200.50" (US format)

                    // Try primitive parse first
                    const simple = parseFloat(str);
                    if (!isNaN(simple) && simple.toString() === str) return simple;

                    // Handle "1.200,00" format
                    let clean = str.replace(/\./g, '').replace(',', '.');
                    const parsed = parseFloat(clean);
                    return isNaN(parsed) ? null : parsed;
                };

                const rawStock = getVal(['Stock', 'stock', 'stock_total', 'Cantidad', 'Cant.', 'Existencia', 'Saldo', 'Disponible']);
                let stockVal = 0;

                if (typeof rawStock === 'string') {
                    const normalized = rawStock.trim().toUpperCase();
                    if (normalized === 'SI') {
                        stockVal = 10; // Available
                    } else if (normalized === 'NO') {
                        stockVal = 0; // Not available
                    } else {
                        stockVal = parseNum(rawStock) || 0;
                    }
                } else {
                    stockVal = parseNum(rawStock) || 0;
                }
                const priceVal = parseNum(getVal(['Precio (DOLAR (U$S))', 'Precio', 'precio', 'price', 'Precio Venta', 'Precio U$S', 'Precio Usd'])) || 0;

                // Prepare base data (scalars)
                const baseData = {
                    // Product Identification
                    sku: String(sku || `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
                    codigoAlfa: getVal(['Cód. Fab.', 'Cód Fab', 'codigo_alfa']) ? String(getVal(['Cód. Fab.', 'Cód Fab', 'codigo_alfa'])) : null,
                    codigoProducto: sku ? String(sku) : null,

                    // Basic Information
                    name: fixEncoding(String(name || '')),
                    description: fixEncoding(String(getVal(['Descripción Detallada', 'Descripcion Detallada', 'description', 'Description']) || getVal(['Descripción Larga', 'Descripcion Larga']) || '')),
                    categoria: catName ? fixEncoding(String(catName)) : null,
                    subCategoria: null,
                    marca: getVal(['Marca', 'brand', 'marca']) ? fixEncoding(String(getVal(['Marca', 'brand', 'marca']))) : null,

                    // Pricing & Taxes
                    precio: priceVal,
                    impuestoInterno: parseNum(getVal(['Impuestos', 'impuesto_interno'])),
                    iva: parseNum(getVal(['IVA', 'iva'])),
                    moneda: 'USD',

                    // Dynamic Calculation
                    markup: null,
                    cotizacion: null,

                    // Physical Properties
                    peso: parseNum(getVal(['Peso', 'peso', 'weight'])),
                    ean: getVal(['EAN', 'ean']) ? String(getVal(['EAN', 'ean'])) : null,

                    // Stock Management
                    nivelStock: null,
                    stockTotal: stockVal, // Ensure valid integer
                    stockDepositoCliente: 0,
                    stockDepositoCd: 0,

                    // Additional Info
                    garantia: getVal(['Garantia', 'garantia']) ? String(getVal(['Garantia', 'garantia'])) : null,
                    link: null,

                    // Media
                    imagen: getVal(['Imagen', 'imagen', 'image', 'imageUrl']) ? String(getVal(['Imagen', 'imagen', 'image', 'imageUrl'])) : null,
                    miniatura: null,

                    // Attributes & Flags
                    atributos: getVal(['Atributos', 'atributos']) ? String(getVal(['Atributos', 'atributos'])) : null,
                    gamer: false,

                    // Legacy fields
                    price: priceVal,
                    stock: stockVal,
                    imageUrl: getVal(['Imagen', 'imagen', 'image', 'imageUrl']) ? String(getVal(['Imagen', 'imagen', 'image', 'imageUrl'])) : null,
                    weight: parseNum(getVal(['Peso', 'peso', 'weight'])),
                    provider,
                };

                // Add relations cleanly
                const createData: any = {
                    ...baseData,
                    category: categoryId ? { connect: { id: categoryId } } : undefined
                };

                const updateData: any = {
                    ...baseData,
                    category: categoryId ? { connect: { id: categoryId } } : { disconnect: true }
                };


                await prisma.product.upsert({
                    where: { sku: baseData.sku },
                    update: updateData,
                    create: createData
                });
                return { status: 'success' };
            } catch (err: any) {
                console.error(`Error processing row: ${err.message}`);
                return { status: 'error', message: err.message };
            }
        }));

        // Tally results
        results.forEach((res: any) => {
            if (res.status === 'success') successCount++;
            if (res.status === 'error') {
                errorCount++;
                if (errors.length < 10) errors.push(res.message); // Store first 10 errors
            }
        });
    }

    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/products');
    revalidatePath('/');

    return {
        success: true,
        count: successCount,
        errors: errorCount > 0 ? errors : undefined,
        message: `Procesados ${successCount} productos correctamente. ${errorCount > 0 ? `${errorCount} errores.` : ''}`
    };
}

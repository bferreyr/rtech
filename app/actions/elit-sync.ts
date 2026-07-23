'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getGlobalMarkup } from "@/app/actions/settings";
import { resolveCategory, fixEncoding } from "./category-utils";

const ELIT_API_URL = 'https://clientes.elit.com.ar/v1/api/productos';
const ELIT_USER_ID = process.env.ELIT_USER_ID || 15169;
const ELIT_TOKEN = process.env.ELIT_TOKEN || 'chmasqzn7a9';

interface ElitProduct {
    id: number;
    codigo_alfa: string;
    codigo_producto: string;
    nombre: string;
    marca: string;
    categoria: string;
    sub_categoria: string;
    precio: number;
    iva: number;
    impuesto_interno: number;
    moneda: number;
    cotizacion: number;
    pvp_usd: number;
    pvp_ars: number;
    markup: number;
    nivel_stock: string;
    stock_total: number;
    stock_deposito_cliente: number;
    stock_deposito_cd: number;
    ean: string;
    peso: number;
    garantia: string;
    imagenes: string[];
    miniaturas: string[];
    atributos: any[];
    link: string;
    gamer: boolean;
}

export async function syncElitProducts() {
    try {
        console.log("Starting ELIT API sync...");
        const globalMarkup = await getGlobalMarkup();
        const markupMultiplier = 1 + (globalMarkup / 100);

        let offset = 0;
        const limit = 100;
        let total = 0;
        let fetched = 0;
        
        const processedSkus: string[] = [];

        do {
            const res = await fetch(`${ELIT_API_URL}?limit=${limit}&offset=${offset}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: Number(ELIT_USER_ID),
                    token: ELIT_TOKEN,
                }),
                cache: 'no-store'
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`ELIT API Error: ${res.status} - ${text}`);
            }

            const data = await res.json();
            if (data.codigo !== 200) {
                throw new Error(`ELIT API logic error: ${JSON.stringify(data)}`);
            }

            total = data.paginador.total;
            const items: ElitProduct[] = data.resultado || [];

            console.log(`Fetched ${items.length} products from offset ${offset}. Progress: ${offset}/${total}`);

            // Process batch
            const promises = items.map(async (item) => {
                const sku = String(item.codigo_producto || item.id);
                processedSkus.push(sku);

                // Categories
                let categoryId = null;
                if (item.categoria) {
                    const parentId = await resolveCategory(item.categoria);
                    if (parentId) {
                        categoryId = parentId;
                        if (item.sub_categoria) {
                            const subId = await resolveCategory(item.sub_categoria, parentId);
                            if (subId) categoryId = subId;
                        }
                    }
                }

                // Pricing
                // Elit returns 'precio' as cost, 'pvp_usd' as suggested retail price.
                // We will apply markup to 'pvp_usd' (or 'precio' if pvp_usd is 0).
                const baseToMarkup = item.pvp_usd > 0 ? item.pvp_usd : (item.precio || 0);
                const finalPrice = baseToMarkup > 0 ? baseToMarkup * markupMultiplier : 0;

                // Stock
                const stockVal = item.stock_total || 0;
                
                // Image
                const imageUrl = item.imagenes && item.imagenes.length > 0 ? item.imagenes[0] : null;

                const baseData = {
                    sku,
                    codigoAlfa: item.codigo_alfa ? String(item.codigo_alfa) : null,
                    codigoProducto: item.codigo_producto ? String(item.codigo_producto) : null,
                    name: fixEncoding(item.nombre),
                    description: item.atributos ? JSON.stringify(item.atributos) : '', // Storing attributes as description temporarily
                    categoria: item.categoria ? fixEncoding(item.categoria) : null,
                    subCategoria: item.sub_categoria ? fixEncoding(item.sub_categoria) : null,
                    marca: item.marca ? fixEncoding(item.marca) : null,
                    
                    precio: item.precio || 0,
                    impuestoInterno: item.impuesto_interno || 0,
                    iva: item.iva || 0,
                    moneda: item.moneda === 1 ? 'ARS' : 'USD', // 1 = Pesos, 2 = Dolares
                    
                    markup: globalMarkup,
                    cotizacion: item.cotizacion || null,
                    pvpUsd: item.pvp_usd || null,
                    pvpArs: item.pvp_ars || null,
                    
                    peso: item.peso || null,
                    ean: item.ean ? String(item.ean) : null,
                    
                    nivelStock: item.nivel_stock || null,
                    stockTotal: item.stock_total || 0,
                    stockDepositoCliente: item.stock_deposito_cliente || 0,
                    stockDepositoCd: item.stock_deposito_cd || 0,
                    
                    garantia: item.garantia || null,
                    link: item.link || null,
                    
                    imagen: imageUrl,
                    miniatura: item.miniaturas && item.miniaturas.length > 0 ? item.miniaturas[0] : null,
                    
                    atributos: item.atributos ? JSON.stringify(item.atributos) : null,
                    gamer: item.gamer || false,
                    
                    price: finalPrice,
                    stock: stockVal,
                    imageUrl,
                    weight: item.peso || null,
                    provider: 'ELIT'
                };

                const updateData: any = {
                    ...baseData,
                    category: categoryId ? { connect: { id: categoryId } } : { disconnect: true }
                };

                const createData: any = {
                    ...baseData,
                    category: categoryId ? { connect: { id: categoryId } } : undefined
                };

                const product = await prisma.product.upsert({
                    where: { sku: sku },
                    update: updateData,
                    create: createData,
                    select: { id: true }
                });

                // Update additional images
                if (item.imagenes && item.imagenes.length > 1) {
                    await prisma.productImage.deleteMany({ where: { productId: product.id } });
                    const additionalImages = item.imagenes.slice(1);
                    await prisma.productImage.createMany({
                        data: additionalImages.map((url, idx) => ({
                            productId: product.id,
                            url,
                            order: idx
                        }))
                    });
                }
            });

            // Wait for all products in this batch to finish
            await Promise.all(promises);

            fetched += items.length;
            offset += limit;

        } while (offset < total);

        // Delete obsoleted products
        if (processedSkus.length > 0) {
            console.log(`Deleting ELIT products not in the latest sync (${processedSkus.length} active SKUs)`);
            const deleted = await prisma.product.deleteMany({
                where: {
                    provider: 'ELIT',
                    sku: { notIn: processedSkus }
                }
            });
            console.log(`Deleted ${deleted.count} obsolete ELIT products.`);
        }

        revalidatePath('/admin/products');
        revalidatePath('/admin/categories');
        revalidatePath('/products');
        revalidatePath('/');

        return { success: true, count: fetched, message: `Sincronizados ${fetched} productos de ELIT exitosamente.` };

    } catch (error: any) {
        console.error("Error in syncElitProducts:", error);
        return { success: false, error: error.message || "Fallo la sincronización con ELIT" };
    }
}

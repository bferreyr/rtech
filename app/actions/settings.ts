'use server';

import { prisma } from "@/lib/prisma";
import { fetchLiveExchangeRate } from "@/lib/exchange-rate";
import { revalidatePath } from "next/cache";

const EXCHANGE_RATE_KEY = "EXCHANGE_RATE";
const AUTO_UPDATE_KEY = "AUTO_UPDATE_RATE";

export async function getExchangeRate() {
    try {
        const [rateSetting] = await Promise.all([
            prisma.setting.findUnique({ where: { key: EXCHANGE_RATE_KEY } }),
            // AUTO_UPDATE is now always true conceptually, but we can still read it if we want
        ]);

        // Forced to true as per user request
        const isAutoUpdate = true;
        let rate = rateSetting ? parseFloat(rateSetting.value) : 1000;

        if (isAutoUpdate) {
            const liveRate = await fetchLiveExchangeRate();
            if (liveRate && liveRate !== rate) {
                // Update DB if live rate changed
                await prisma.setting.upsert({
                    where: { key: EXCHANGE_RATE_KEY },
                    update: { value: liveRate.toString() },
                    create: {
                        key: EXCHANGE_RATE_KEY,
                        value: liveRate.toString(),
                        description: "Dólar exchange rate (USD/ARS)",
                    },
                });
                rate = liveRate;
            }
        }

        return {
            rate,
            isAutoUpdate,
            lastUpdated: rateSetting?.updatedAt || new Date(),
        };
    } catch (error) {
        console.error("Error getting exchange rate:", error);
        return { rate: 1000, isAutoUpdate: true, lastUpdated: new Date() };
    }
}

export async function updateExchangeRate(rate: number, autoUpdate: boolean) {
    try {
        const forcedAutoUpdate = true;

        await prisma.$transaction([
            prisma.setting.upsert({
                where: { key: EXCHANGE_RATE_KEY },
                update: { value: rate.toString() },
                create: {
                    key: EXCHANGE_RATE_KEY,
                    value: rate.toString(),
                    description: "Dólar exchange rate (USD/ARS)",
                },
            }),
            prisma.setting.upsert({
                where: { key: AUTO_UPDATE_KEY },
                update: { value: forcedAutoUpdate.toString() },
                create: {
                    key: AUTO_UPDATE_KEY,
                    value: forcedAutoUpdate.toString(),
                    description: "Whether to auto-update rate from DolarApi",
                },
            }),
        ]);

        // Recalculate ARS prices for all products
        // We can do this asynchronously if there are many products, but for now we wait to ensure consistency
        const products = await prisma.product.findMany({
            select: { id: true, pvpUsd: true, price: true }
        });

        const updates = products.map(p => {
            // pvpUsd is the primary source if it exists, otherwise legacy price
            const usdPrice = p.pvpUsd ? Number(p.pvpUsd) : Number(p.price);
            const newArs = usdPrice * rate;

            return prisma.product.update({
                where: { id: p.id },
                data: {
                    pvpArs: newArs,
                    cotizacion: rate
                }
            });
        });

        // Execute in batches to avoid connection saturation
        // Simple Promise.all for now
        await Promise.all(updates);

        revalidatePath("/admin/settings");
        revalidatePath("/products");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error updating exchange rate:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

const GLOBAL_MARKUP_KEY = "GLOBAL_MARKUP";

export async function getGlobalMarkup() {
    try {
        const setting = await prisma.setting.findUnique({
            where: { key: GLOBAL_MARKUP_KEY }
        });
        // Default markup 30% if not set
        return setting ? parseFloat(setting.value) : 30;
    } catch (error) {
        console.error("Error getting markup:", error);
        return 30;
    }
}

export async function updateGlobalMarkup(markup: number) {
    try {
        await prisma.setting.upsert({
            where: { key: GLOBAL_MARKUP_KEY },
            update: { value: markup.toString() },
            create: {
                key: GLOBAL_MARKUP_KEY,
                value: markup.toString(),
                description: "Global profit margin percentage",
            },
        });

        // Get current exchange rate for full recalculation
        const rateData = await getExchangeRate();
        const rate = rateData.rate;

        // Recalculate ALL prices based on Base Cost (precio)
        const products = await prisma.product.findMany({
            select: { id: true, precio: true }
        });

        const updates = products.map(p => {
            const cost = Number(p.precio || 0);
            const newPvpUsd = cost * (1 + markup / 100);
            const newPvpArs = newPvpUsd * rate;

            return prisma.product.update({
                where: { id: p.id },
                data: {
                    markup: markup,
                    pvpUsd: newPvpUsd,
                    pvpArs: newPvpArs,
                    price: newPvpUsd, // Update legacy price field too
                    // We don't update cotizacion here as it hasn't changed, but valid to keep sync
                }
            });
        });

        await Promise.all(updates);

        revalidatePath("/admin/settings");
        revalidatePath("/products");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error updating markup:", error);
        return { success: false, error: "Failed to update markup" };
    }
}

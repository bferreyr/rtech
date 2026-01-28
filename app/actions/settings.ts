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

        revalidatePath("/admin/settings");
        revalidatePath("/products");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error updating markup:", error);
        return { success: false, error: "Failed to update markup" };
    }
}

const MODO_CLIENT_ID_KEY = "MODO_CLIENT_ID";
const MODO_CLIENT_SECRET_KEY = "MODO_CLIENT_SECRET";
const MODO_STORE_ID_KEY = "MODO_STORE_ID";

export interface ModoSettings {
    clientId: string;
    clientSecret: string;
    storeId: string;
}

export async function getModoSettings(): Promise<ModoSettings> {
    try {
        const [clientId, clientSecret, storeId] = await Promise.all([
            prisma.setting.findUnique({ where: { key: MODO_CLIENT_ID_KEY } }),
            prisma.setting.findUnique({ where: { key: MODO_CLIENT_SECRET_KEY } }),
            prisma.setting.findUnique({ where: { key: MODO_STORE_ID_KEY } }),
        ]);
        return {
            clientId: clientId?.value || "",
            clientSecret: clientSecret?.value || "",
            storeId: storeId?.value || "",
        };
    } catch (error) {
        console.error("Error getting MODO settings:", error);
        return { clientId: "", clientSecret: "", storeId: "" };
    }
}

export async function updateModoSettings(settings: ModoSettings) {
    try {
        await prisma.$transaction([
            prisma.setting.upsert({
                where: { key: MODO_CLIENT_ID_KEY },
                update: { value: settings.clientId },
                create: {
                    key: MODO_CLIENT_ID_KEY,
                    value: settings.clientId,
                    description: "MODO Client ID",
                },
            }),
            prisma.setting.upsert({
                where: { key: MODO_CLIENT_SECRET_KEY },
                update: { value: settings.clientSecret },
                create: {
                    key: MODO_CLIENT_SECRET_KEY,
                    value: settings.clientSecret,
                    description: "MODO Client Secret",
                },
            }),
            prisma.setting.upsert({
                where: { key: MODO_STORE_ID_KEY },
                update: { value: settings.storeId },
                create: {
                    key: MODO_STORE_ID_KEY,
                    value: settings.storeId,
                    description: "MODO Store ID",
                },
            }),
        ]);

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating MODO settings:", error);
        return { success: false, error: "Failed to update MODO settings" };
    }
}

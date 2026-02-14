'use server';

import { prisma } from "@/lib/prisma";
import { fetchLiveExchangeRate } from "@/lib/exchange-rate";
import { revalidatePath } from "next/cache";

const EXCHANGE_RATE_KEY = "EXCHANGE_RATE";
const AUTO_UPDATE_KEY = "AUTO_UPDATE_RATE";

export async function getExchangeRate() {
    try {
        const [rateSetting, autoUpdateSetting] = await Promise.all([
            prisma.setting.findUnique({ where: { key: EXCHANGE_RATE_KEY } }),
            prisma.setting.findUnique({ where: { key: AUTO_UPDATE_KEY } }),
        ]);

        // Read auto-update setting from database, default to true if not set
        const isAutoUpdate = autoUpdateSetting ? autoUpdateSetting.value === 'true' : true;
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

export async function getExternalDollarRate() {
    try {
        const rate = await fetchLiveExchangeRate();
        return rate;
    } catch (error) {
        return null;
    }
}

export async function updateExchangeRate(rate: number, autoUpdate: boolean) {
    try {
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
                update: { value: autoUpdate.toString() },
                create: {
                    key: AUTO_UPDATE_KEY,
                    value: autoUpdate.toString(),
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

const MP_PUBLIC_KEY = "MP_PUBLIC_KEY";
const MP_ACCESS_TOKEN = "MP_ACCESS_TOKEN";

export async function getMPSettings() {
    try {
        const [publicKey, accessToken] = await Promise.all([
            prisma.setting.findUnique({ where: { key: MP_PUBLIC_KEY } }),
            prisma.setting.findUnique({ where: { key: MP_ACCESS_TOKEN } }),
        ]);

        return {
            publicKey: publicKey?.value || "",
            accessToken: accessToken?.value || "",
        };
    } catch (error) {
        console.error("Error getting MP settings:", error);
        return { publicKey: "", accessToken: "" };
    }
}

export async function updateMPSettings(publicKey: string, accessToken: string) {
    try {
        await prisma.$transaction([
            prisma.setting.upsert({
                where: { key: MP_PUBLIC_KEY },
                update: { value: publicKey },
                create: {
                    key: MP_PUBLIC_KEY,
                    value: publicKey,
                    description: "Mercado Pago Public Key",
                },
            }),
            prisma.setting.upsert({
                where: { key: MP_ACCESS_TOKEN },
                update: { value: accessToken },
                create: {
                    key: MP_ACCESS_TOKEN,
                    value: accessToken,
                    description: "Mercado Pago Access Token",
                },
            }),
        ]);

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating MP settings:", error);
        return { success: false, error: "Failed to update MP settings" };
    }
}

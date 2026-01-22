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
        // We force autoUpdate to true even if the UI somehow sends false
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
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error updating exchange rate:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

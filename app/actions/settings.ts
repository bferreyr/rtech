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

// ============================================================================
// OCA Settings
// ============================================================================

export interface OCASettings {
    environment: 'testing' | 'production';
    username: string;
    password: string;
    accountNumber: string;
    cuit: string;
    operativaPP: string;
    operativaPS: string;
    originAddress: string;
    originNumber: string;
    originFloor: string;
    originApartment: string;
    originZip: string;
    originCity: string;
    originProvince: string;
    originEmail: string;
    originObservations: string;
    defaultDimensions: {
        width: number;
        height: number;
        depth: number;
    };
    defaultTimeframe: string;
}

export async function getOCASettings(): Promise<OCASettings> {
    try {
        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    startsWith: 'oca_'
                }
            }
        });

        const getValue = (key: string, defaultValue: string = ''): string => {
            const setting = settings.find(s => s.key === key);
            return setting?.value || defaultValue;
        };

        const dimensions = JSON.parse(getValue('oca_default_dimensions', '{"width":10,"height":10,"depth":10}'));

        return {
            environment: getValue('oca_environment', 'testing') as 'testing' | 'production',
            username: getValue('oca_username'),
            password: getValue('oca_password'),
            accountNumber: getValue('oca_account'),
            cuit: getValue('oca_cuit'),
            operativaPP: getValue('oca_operativa_pp'),
            operativaPS: getValue('oca_operativa_ps'),
            originAddress: getValue('oca_origin_address'),
            originNumber: getValue('oca_origin_number'),
            originFloor: getValue('oca_origin_floor'),
            originApartment: getValue('oca_origin_apartment'),
            originZip: getValue('oca_origin_zip'),
            originCity: getValue('oca_origin_city'),
            originProvince: getValue('oca_origin_province'),
            originEmail: getValue('oca_origin_email'),
            originObservations: getValue('oca_origin_observations'),
            defaultDimensions: dimensions,
            defaultTimeframe: getValue('oca_default_timeframe', '1'),
        };
    } catch (error) {
        console.error("Error getting OCA settings:", error);
        return {
            environment: 'testing',
            username: '',
            password: '',
            accountNumber: '',
            cuit: '',
            operativaPP: '',
            operativaPS: '',
            originAddress: '',
            originNumber: '',
            originFloor: '',
            originApartment: '',
            originZip: '',
            originCity: '',
            originProvince: '',
            originEmail: '',
            originObservations: '',
            defaultDimensions: { width: 10, height: 10, depth: 10 },
            defaultTimeframe: '1',
        };
    }
}

export async function updateOCASettings(settings: OCASettings) {
    try {
        const updates = [
            { key: 'oca_environment', value: settings.environment, desc: 'Ambiente OCA' },
            { key: 'oca_username', value: settings.username, desc: 'Usuario e-Pak' },
            { key: 'oca_password', value: settings.password, desc: 'Contraseña e-Pak' },
            { key: 'oca_account', value: settings.accountNumber, desc: 'Número de cuenta OCA' },
            { key: 'oca_cuit', value: settings.cuit, desc: 'CUIT del cliente' },
            { key: 'oca_operativa_pp', value: settings.operativaPP, desc: 'Operativa Puerta a Puerta' },
            { key: 'oca_operativa_ps', value: settings.operativaPS, desc: 'Operativa Puerta a Sucursal' },
            { key: 'oca_origin_address', value: settings.originAddress, desc: 'Dirección de origen' },
            { key: 'oca_origin_number', value: settings.originNumber, desc: 'Número de dirección' },
            { key: 'oca_origin_floor', value: settings.originFloor, desc: 'Piso' },
            { key: 'oca_origin_apartment', value: settings.originApartment, desc: 'Departamento' },
            { key: 'oca_origin_zip', value: settings.originZip, desc: 'Código postal de origen' },
            { key: 'oca_origin_city', value: settings.originCity, desc: 'Ciudad de origen' },
            { key: 'oca_origin_province', value: settings.originProvince, desc: 'Provincia de origen' },
            { key: 'oca_origin_email', value: settings.originEmail, desc: 'Email de contacto' },
            { key: 'oca_origin_observations', value: settings.originObservations, desc: 'Observaciones' },
            { key: 'oca_default_dimensions', value: JSON.stringify(settings.defaultDimensions), desc: 'Dimensiones por defecto' },
            { key: 'oca_default_timeframe', value: settings.defaultTimeframe, desc: 'Franja horaria por defecto' },
        ];

        await prisma.$transaction(
            updates.map(({ key, value, desc }) =>
                prisma.setting.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value, description: desc },
                })
            )
        );

        // Clear OCA service cache
        const { ocaService } = await import('@/lib/oca');
        ocaService.clearCache();

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating OCA settings:", error);
        return { success: false, error: "Failed to update OCA settings" };
    }
}

'use server'

import { prisma } from "@/lib/prisma";
import { getExchangeRate, getModoSettings } from "@/app/actions/settings";
import { v4 as uuidv4 } from 'uuid';

interface CheckoutData {
    email: string;
    name: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
        title: string;
    }>;
    total: number;
    shippingAddress?: {
        address: string;
        city: string;
        province: string;
        zip: string;
    };
    shippingOption?: {
        name: string;
        cost: number;
    };
    pointsToRedeem?: number;
}

// MODO API Base URL (Production)
const MODO_API_URL = "https://backend.modo.com.ar/v1";

/**
 * Authenticate with MODO API to get access token
 */
async function getModoToken() {
    const settings = await getModoSettings();
    if (!settings.clientId || !settings.clientSecret) {
        throw new Error("MODO Credentials not configured");
    }

    const response = await fetch(`${MODO_API_URL}/auth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: settings.clientId,
            client_secret: settings.clientSecret,
            grant_type: "client_credentials",
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("MODO Auth Error:", error);
        throw new Error("Failed to authenticate with MODO");
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * Create Payment Intent in MODO
 */
export async function createModoPreference(data: CheckoutData) {
    try {
        const settings = await getModoSettings();
        if (!settings.storeId) {
            throw new Error("MODO Store ID not configured");
        }

        // 1. Get Access Token
        const token = await getModoToken();

        // 2. Find or Create User
        let user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: '',
                    role: 'USER'
                }
            });
        }

        // @ts-ignore
        if (user.isBlocked) throw new Error('Tu cuenta está bloqueada');
        // @ts-ignore
        if (!user.canPurchase) throw new Error('Tu cuenta tiene las compras deshabilitadas temporalmente');

        // 3. Calculate Rate and Points
        const { rate } = await getExchangeRate();

        // Handle Points Redemption
        let discount = 0;
        if (data.pointsToRedeem && data.pointsToRedeem > 0) {
            // @ts-ignore
            const availablePoints = user.points || 0;
            const pointsToUse = Math.min(data.pointsToRedeem, availablePoints);
            const maxDiscount = data.total * 0.5;
            discount = Math.min(pointsToUse, maxDiscount);

            if (discount > 0) {
                await prisma.$transaction([
                    // @ts-ignore
                    prisma.user.update({
                        where: { id: user.id },
                        // @ts-ignore
                        data: { points: { decrement: Math.floor(discount) } }
                    }),
                    // @ts-ignore
                    prisma.pointHistory.create({
                        data: {
                            userId: user.id,
                            amount: -Math.floor(discount),
                            type: 'REDEEMED',
                            description: `Descuento aplicado en orden pendiente`
                        }
                    })
                ]);
            }
        }

        const finalAmountUSD = data.total - discount;
        const totalAmountARS = Math.round(finalAmountUSD * rate); // MODO requires ARS

        // 4. Create Order in DB
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: finalAmountUSD,
                status: 'PENDING',
                // @ts-ignore
                shippingAddress: data.shippingAddress ? `${data.shippingAddress.address}, ${data.shippingAddress.city}, ${data.shippingAddress.province} (${data.shippingAddress.zip})` : null,
                shippingZip: data.shippingAddress?.zip,
                shippingCost: data.shippingOption?.cost,
                shippingMethod: data.shippingOption?.name,
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        // 5. Create Payment Intent (MODO)
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const externalId = order.id;

        const payload = {
            amount: totalAmountARS,
            currency: "ARS",
            external_id: externalId,
            description: `Compra en RTECH - Orden #${order.id.slice(-8)}`,
            store_id: settings.storeId,
            callback_url: `${baseUrl}/api/webhooks/modo`,
            redirect_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
            // MODO might use 'payment_methods' or similar fields depending on version,
            // using standard structure for "Online Payment" 
            products: data.items.map(item => ({
                name: item.title,
                quantity: item.quantity,
                unit_price: Math.round(item.price * rate)
            })),
            payer: {
                email: data.email,
                name: data.name
            }
        };

        const paymentResponse = await fetch(`${MODO_API_URL}/payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!paymentResponse.ok) {
            const errorText = await paymentResponse.text();
            console.error("MODO Payment Creation Error:", errorText);
            throw new Error("Error al crear intención de pago en MODO: " + errorText);
        }

        const paymentData = await paymentResponse.json();

        // Return the checkout URL (or qr string if applicable)
        // Adjust based on actual response structure: usually 'checkout_url' or 'qr'
        return {
            success: true,
            orderId: order.id,
            initPoint: paymentData.checkout_url || paymentData.url, // Redirect URL
            qr: paymentData.qr // QR string if needed
        };

    } catch (error: any) {
        console.error('Error creating MODO preference:', error);
        return {
            success: false,
            error: error.message || "Error desconocido al procesar pago"
        };
    }
}

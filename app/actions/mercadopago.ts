'use server'

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { prisma } from "@/lib/prisma";
import { getExchangeRate } from "@/app/actions/settings";

// Inicializar MercadoPago con Access Token
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
    options: { timeout: 5000 }
});

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

export async function createMercadoPagoPreference(data: CheckoutData) {
    try {
        // Validar que existan las credenciales
        if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
            throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado');
        }

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            // Password logic: we'll set it empty for now, user can reset it later or we can send a welcome email
            user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: '', // Should be handled with care in prod
                    role: 'USER'
                }
            });
        }

        // @ts-ignore
        if (user.isBlocked) {
            throw new Error('Tu cuenta está bloqueada');
        }

        // @ts-ignore
        if (!user.canPurchase) {
            throw new Error('Tu cuenta tiene las compras deshabilitadas temporalmente');
        }

        // Obtener cotización del día
        const { rate } = await getExchangeRate();

        // Points Redemption Logic
        let discount = 0;
        if (data.pointsToRedeem && data.pointsToRedeem > 0) {
            // @ts-ignore
            const availablePoints = user.points || 0;
            const pointsToUse = Math.min(data.pointsToRedeem, availablePoints);

            // Max discount: 50% of total
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

        const finalAmount = data.total - discount;

        // Create order in PENDING status
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: finalAmount,
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

        // Crear preferencia de MercadoPago
        const preference = new Preference(client);

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const preferenceData = await preference.create({
            body: {
                items: data.items.map(item => ({
                    id: item.productId,
                    title: item.title,
                    quantity: item.quantity,
                    unit_price: Math.round(item.price * rate), // Convert to ARS and round
                    currency_id: 'ARS'
                })),
                payer: {
                    name: data.name,
                    email: data.email
                },
                back_urls: {
                    success: `${baseUrl}/checkout/success?orderId=${order.id}`,
                    failure: `${baseUrl}/checkout/failure?orderId=${order.id}`,
                    pending: `${baseUrl}/checkout/pending?orderId=${order.id}`
                },
                auto_return: 'approved',
                external_reference: order.id,
                notification_url: `${baseUrl}/api/webhooks/mercadopago`,
                statement_descriptor: 'RTECH Store',
                metadata: {
                    order_id: order.id
                }
            }
        });

        return {
            success: true,
            preferenceId: preferenceData.id,
            orderId: order.id,
            initPoint: preferenceData.init_point // URL para redireccionar
        };
    } catch (error) {
        console.error('Error creating MercadoPago preference:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al crear preferencia de pago'
        };
    }
}

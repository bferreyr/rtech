
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getMPSettings } from '@/app/actions/settings';

export async function createPreference(items: any[], orderId: string) {
    const settings = await getMPSettings();

    // Use DB token first, fallback to environment variable
    const accessToken = settings.accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error("Mercado Pago Access Token not configured. Set it in Admin > Settings or in MERCADOPAGO_ACCESS_TOKEN env var.");
    }

    // Validate items: unit_price must be a positive integer (ARS)
    const validatedItems = items.map(item => {
        const unitPrice = Math.round(Number(item.unit_price));
        if (!unitPrice || unitPrice <= 0 || isNaN(unitPrice)) {
            throw new Error(`Invalid unit_price for item "${item.title}": ${item.unit_price}. Ensure exchange rate is configured and product has a valid price.`);
        }
        return {
            id: String(item.id),
            title: String(item.title),
            description: String(item.description || item.title), // MP quality: item description
            category_id: 'electronics',                          // MP quality: category_id
            quantity: Number(item.quantity),
            unit_price: unitPrice,
            currency_id: 'ARS',
        };
    });

    console.log("[MP] Creating preference for order:", orderId);
    console.log("[MP] Items:", JSON.stringify(validatedItems));
    console.log("[MP] Token source:", settings.accessToken ? "Database" : "Environment Variable");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const response = await preference.create({
        body: {
            statement_descriptor: 'RTECH',  // MP quality: nombre en resumen de tarjeta
            items: validatedItems,
            back_urls: {
                success: `${appUrl}/checkout/success?orderId=${orderId}`,
                failure: `${appUrl}/checkout?error=payment_failed`,
                pending: `${appUrl}/checkout/pending?orderId=${orderId}`
            },
            auto_return: 'approved',
            external_reference: orderId,
            notification_url: `${appUrl}/api/webhooks/mercadopago`
        }
    });

    console.log("[MP] Preference created successfully. Init point:", response.init_point);
    return response.init_point;
}

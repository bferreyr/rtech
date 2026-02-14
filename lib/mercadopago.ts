
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getMPSettings } from '@/app/actions/settings';

export async function createPreference(items: any[], orderId: string) {
    const settings = await getMPSettings();

    if (!settings.accessToken) {
        throw new Error("Mercado Pago Access Token not configured");
    }

    const client = new MercadoPagoConfig({ accessToken: settings.accessToken });
    const preference = new Preference(client);

    const response = await preference.create({
        body: {
            items: items.map(item => ({
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                unit_price: Number(item.unit_price),
                currency_id: 'ARS'
            })),
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}`,
                failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=payment_failed`,
                pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending?orderId=${orderId}`
            },
            auto_return: 'approved',
            external_reference: orderId,
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`
        }
    });

    return response.init_point;
}

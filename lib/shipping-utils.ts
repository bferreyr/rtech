// Free shipping zones for Santa Fe
export const FREE_SHIPPING_CITIES = [
    'Santa Fe',
    'Colastine Norte',
    'Colastine Centro',
    'Colastine Sur',
    'San José del Rincón',
    'Arroyo Leyes'
];

export const SHIPPING_TYPES = {
    STANDARD: 'STANDARD',
    EXPRESS: 'EXPRESS',
    PICKUP: 'PICKUP'
} as const;

export type ShippingType = typeof SHIPPING_TYPES[keyof typeof SHIPPING_TYPES];

export function isFreeShippingZone(city: string, province: string): boolean {
    // Check if province is Santa Fe
    if (province !== 'Santa Fe') {
        return false;
    }

    // Check if city is in free shipping list (case insensitive)
    return FREE_SHIPPING_CITIES.some(
        freeCity => freeCity.toLowerCase() === city.toLowerCase()
    );
}

export function getShippingTypeLabel(type: string): string {
    switch (type) {
        case SHIPPING_TYPES.STANDARD:
            return 'Envío Standard';
        case SHIPPING_TYPES.EXPRESS:
            return 'Envío Express';
        case SHIPPING_TYPES.PICKUP:
            return 'Retiro en Tienda';
        default:
            return type;
    }
}

export function getShippingTypeDescription(type: string): string {
    switch (type) {
        case SHIPPING_TYPES.STANDARD:
            return 'Corre por cuenta del cliente';
        case SHIPPING_TYPES.EXPRESS:
            return 'Corre por cuenta del cliente';
        case SHIPPING_TYPES.PICKUP:
            return 'Retiro gratuito en nuestra dirección';
        default:
            return '';
    }
}

import { z } from 'zod';

// Phone regex for Argentina: +54 9 11 1234-5678 or variations
const phoneRegex = /^(\+54\s?)?(\d{2,4})[\s-]?\d{4}[\s-]?\d{4}$/;

// Postal code regex for Argentina (4 digits)
const postalCodeRegex = /^\d{4}$/;

export const checkoutSchema = z.object({
    // Contacto
    customerName: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre es demasiado largo'),

    customerEmail: z
        .string()
        .email('Email inválido')
        .toLowerCase(),

    customerPhone: z
        .string()
        .regex(phoneRegex, 'Formato inválido. Ej: +54 11 1234-5678 o 11 1234-5678'),

    // Envío
    address: z
        .string()
        .min(5, 'La dirección debe tener al menos 5 caracteres')
        .max(200, 'La dirección es demasiado larga'),

    province: z
        .string()
        .min(2, 'Selecciona una provincia'),

    city: z
        .string()
        .min(2, 'Selecciona una ciudad'),

    zip: z
        .string()
        .regex(postalCodeRegex, 'Código postal inválido (4 dígitos)'),

    details: z
        .string()
        .max(500, 'La descripción es demasiado larga')
        .optional(),

    // Tipo de envío
    shippingType: z.enum(['STANDARD', 'EXPRESS', 'PICKUP'], {
        required_error: 'Selecciona un tipo de envío',
    }),

    // Pago
    paymentMethod: z.enum(['mercadopago', 'transferencia'], {
        required_error: 'Selecciona un método de pago',
    }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Validation helpers
export const validateEmail = (email: string): boolean => {
    return z.string().email().safeParse(email).success;
};

export const validatePhone = (phone: string): boolean => {
    return phoneRegex.test(phone);
};

export const validatePostalCode = (code: string): boolean => {
    return postalCodeRegex.test(code);
};

// Field state types
export type FieldState = 'idle' | 'typing' | 'validating' | 'valid' | 'invalid';

export interface FieldValidation {
    state: FieldState;
    error?: string;
}

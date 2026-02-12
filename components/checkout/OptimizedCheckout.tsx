'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, MapPin, CreditCard, Mail, Phone, Building2 } from 'lucide-react';
import { checkoutSchema, CheckoutFormData, FieldState } from '@/lib/checkout-validation';
import { FormField, TextareaField } from './FormField';
import { ProgressIndicator } from './ProgressIndicator';
import { OrderSummary } from './OrderSummary';
import { ShippingOptions } from './ShippingOptions';
import { LocationSelector } from './LocationSelector';
import { ReceiptUpload } from './ReceiptUpload';
import { isFreeShippingZone, SHIPPING_TYPES } from '@/lib/shipping-utils';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/context/CartContext';


interface OptimizedCheckoutProps {
    items: CartItem[];
    cartTotal: number;
    onClearCart: () => void;
}

export function OptimizedCheckout({ items, cartTotal, onClearCart }: OptimizedCheckoutProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [currentStep, setCurrentStep] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid, dirtyFields }
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        mode: 'onChange',
    });

    // Watch form values
    const province = watch('province');
    const city = watch('city');
    const shippingType = watch('shippingType', SHIPPING_TYPES.STANDARD);
    const paymentMethod = watch('paymentMethod');

    // Calculate if shipping is free
    const isFreeShipping = shippingType === SHIPPING_TYPES.PICKUP || isFreeShippingZone(city, province);
    const shippingCost = 0; // Always 0 - customer pays or it's free
    const total = cartTotal;

    // Progress steps
    const steps = [
        { id: 'contact', label: 'Contacto', completed: !!(dirtyFields.customerName && dirtyFields.customerEmail && dirtyFields.customerPhone && !errors.customerName && !errors.customerEmail && !errors.customerPhone) },
        { id: 'shipping', label: 'Envío', completed: !!(dirtyFields.address && dirtyFields.province && dirtyFields.city && dirtyFields.zip && !errors.address && !errors.province && !errors.city && !errors.zip) },
        { id: 'payment', label: 'Pago', completed: !!paymentMethod },
    ];

    // Update current step based on completion
    useEffect(() => {
        const completedSteps = steps.filter(s => s.completed).length;
        setCurrentStep(completedSteps);
    }, [steps]);

    // Get field state for visual feedback
    const getFieldState = (fieldName: keyof CheckoutFormData): FieldState => {
        if (errors[fieldName]) return 'invalid';
        if (dirtyFields[fieldName] && !errors[fieldName]) return 'valid';
        if (dirtyFields[fieldName]) return 'typing';
        return 'idle';
    };

    const onSubmit = async (data: CheckoutFormData) => {
        setError(null);
        setIsSubmitting(true);

        try {
            let receiptUrl = null;

            // Upload receipt if transferencia
            if (paymentMethod === 'transferencia' && receiptFile) {
                const formData = new FormData();
                formData.append('receipt', receiptFile);

                const uploadRes = await fetch('/api/upload/receipt', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error('Error al subir el comprobante');
                }

                const uploadData = await uploadRes.json();
                receiptUrl = uploadData.url;
            }

            // Create order
            const orderData = {
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                shippingAddress: data.address,
                shippingProvince: data.province,
                shippingCity: data.city,
                shippingZip: data.zip,
                shippingDetails: data.details || null,
                shippingType: data.shippingType,
                shippingCost,
                isFreeShipping,
                paymentMethod: data.paymentMethod,
                paymentReceiptUrl: receiptUrl,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total,
            };

            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el pedido');
            }

            const order = await response.json();

            // Clear cart
            onClearCart();

            // Redirect based on payment method
            if (paymentMethod === 'mercadopago') {
                window.location.href = `https://link.mercadopago.com.ar/rincontech?amount=${total}`;
            } else {
                router.push(`/orders/${order.id}?success=true`);
            }

        } catch (err: any) {
            setError(err.message || 'Error al procesar el pedido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Checkout Seguro 🔒</h1>
                    <p className="text-[hsl(var(--text-secondary))]">
                        Completa tu información para finalizar la compra
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <ProgressIndicator steps={steps} currentStep={currentStep} />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 1. Contact Information */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">1. Información de Contacto</h2>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        label="Nombre y Apellido"
                                        required
                                        fieldState={getFieldState('customerName')}
                                        error={errors.customerName?.message}
                                        {...register('customerName')}
                                        placeholder="Juan Pérez"
                                    />

                                    <FormField
                                        label="Correo Electrónico"
                                        type="email"
                                        required
                                        icon={<Mail className="w-5 h-5" />}
                                        fieldState={getFieldState('customerEmail')}
                                        error={errors.customerEmail?.message}
                                        {...register('customerEmail')}
                                        placeholder="tu@email.com"
                                    />

                                    <FormField
                                        label="Teléfono de Contacto"
                                        type="tel"
                                        required
                                        icon={<Phone className="w-5 h-5" />}
                                        fieldState={getFieldState('customerPhone')}
                                        error={errors.customerPhone?.message}
                                        {...register('customerPhone')}
                                        placeholder="+54 11 1234-5678"
                                    />
                                </div>
                            </div>

                            {/* 2. Shipping Address */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">2. Dirección de Envío</h2>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        label="Dirección y Altura"
                                        required
                                        fieldState={getFieldState('address')}
                                        error={errors.address?.message}
                                        {...register('address')}
                                        placeholder="Av. Corrientes 1234"
                                    />

                                    <LocationSelector
                                        selectedProvince={province}
                                        selectedCity={city}
                                        onProvinceChange={(value) => setValue('province', value, { shouldValidate: true, shouldDirty: true })}
                                        onCityChange={(value) => setValue('city', value, { shouldValidate: true, shouldDirty: true })}
                                    />

                                    <FormField
                                        label="Código Postal"
                                        required
                                        fieldState={getFieldState('zip')}
                                        error={errors.zip?.message}
                                        {...register('zip')}
                                        placeholder="3000"
                                        maxLength={4}
                                    />

                                    <TextareaField
                                        label="Detalles Adicionales (Piso, Depto, etc.)"
                                        icon={<Building2 className="w-5 h-5" />}
                                        error={errors.details?.message}
                                        {...register('details')}
                                        placeholder="Ej: Depto 4B, Piso 2, Timbre 10"
                                        rows={3}
                                    />

                                    {/* Shipping Options */}
                                    <div className="pt-4">
                                        <h3 className="text-lg font-semibold mb-3">Opciones de Envío</h3>
                                        <ShippingOptions
                                            selectedType={shippingType}
                                            onSelect={(type) => setValue('shippingType', type as any, { shouldValidate: true })}
                                            isFreeShipping={isFreeShipping}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Payment Method */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold">3. Método de Pago</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* MercadoPago */}
                                    <div
                                        onClick={() => setValue('paymentMethod', 'mercadopago', { shouldValidate: true })}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'mercadopago'
                                            ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                            : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--accent-primary))]/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                value="mercadopago"
                                                checked={paymentMethod === 'mercadopago'}
                                                {...register('paymentMethod')}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">MercadoPago</p>
                                                <p className="text-sm text-[hsl(var(--text-secondary))]">Pago online seguro</p>
                                            </div>
                                            <CreditCard className="w-6 h-6 text-[hsl(var(--accent-primary))]" />
                                        </div>
                                    </div>

                                    {/* Transferencia */}
                                    <div
                                        onClick={() => setValue('paymentMethod', 'transferencia', { shouldValidate: true })}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'transferencia'
                                            ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                            : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--accent-primary))]/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                value="transferencia"
                                                checked={paymentMethod === 'transferencia'}
                                                {...register('paymentMethod')}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">Transferencia Bancaria</p>
                                                <p className="text-sm text-[hsl(var(--text-secondary))]">Realizá la transferencia y subí el comprobante</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Details for Transferencia */}
                                    {paymentMethod === 'transferencia' && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            <div className="p-4 rounded-lg bg-[hsl(var(--bg-tertiary))] border border-[hsl(var(--border-color))]">
                                                <p className="text-sm font-semibold mb-3 text-[hsl(var(--accent-primary))]">Datos para Transferencia</p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">Titular:</span>
                                                        <span className="font-medium">Bartolome Ferreyra</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">CUIT/CUIL:</span>
                                                        <span className="font-medium font-mono">20-37260801-4</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">Banco:</span>
                                                        <span className="font-medium">Santander</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">Número Cuenta:</span>
                                                        <span className="font-medium font-mono">156-249043/2</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">CBU:</span>
                                                        <span className="font-medium font-mono text-xs">0720156788000024904322</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[hsl(var(--text-secondary))]">Alias:</span>
                                                        <span className="font-medium">bartu.ferreyra</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-lg bg-[hsl(var(--bg-tertiary))]">
                                                <p className="text-sm font-medium mb-3">Subir Comprobante de Pago *</p>
                                                <ReceiptUpload
                                                    selectedFile={receiptFile}
                                                    onFileSelect={setReceiptFile}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {errors.paymentMethod && (
                                        <p className="text-sm text-red-400">{errors.paymentMethod.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <OrderSummary
                                items={items}
                                subtotal={cartTotal}
                                shippingCost={shippingCost}
                                total={total}
                                onCheckout={handleSubmit(onSubmit)}
                                checkoutDisabled={!isValid || (paymentMethod === 'transferencia' && !receiptFile)}
                                checkoutLoading={isSubmitting}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

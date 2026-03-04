import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { createPreference } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        const data = await request.json();

        // ... existing validation ...
        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            shippingProvince,
            shippingCity,
            shippingZip,
            shippingDetails,
            shippingType,
            // shippingCost, // Ignored from client
            isFreeShipping,
            paymentMethod,
            paymentReceiptUrl,
            items, // We only trust productId and quantity
            // total, // Ignored from client
        } = data;

        // Validate required fields
        if (!customerName || !customerEmail || !customerPhone) {
            return NextResponse.json(
                { error: 'Información de contacto incompleta' },
                { status: 400 }
            );
        }

        if (!shippingAddress || !shippingProvince || !shippingCity || !shippingZip) {
            return NextResponse.json(
                { error: 'Dirección de envío incompleta' },
                { status: 400 }
            );
        }

        if (!paymentMethod || !['mercadopago', 'transferencia'].includes(paymentMethod)) {
            return NextResponse.json(
                { error: 'Método de pago inválido' },
                { status: 400 }
            );
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'El carrito está vacío' },
                { status: 400 }
            );
        }

        // --- SERVER SIDE PRICE CALCULATION START ---

        // 1. Fetch all products involved
        const productIds = items.map((item: any) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        if (products.length !== items.length) {
            // Check if any product was not found
        }

        // Fetch Global Markup
        const { getGlobalMarkup } = await import('@/app/actions/settings');
        const globalMarkup = await getGlobalMarkup();
        const markupMultiplier = 1 + (globalMarkup / 100);

        let calculatedTotal = 0;
        const validItems = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);

            if (!product) {
                return NextResponse.json(
                    { error: `Producto no encontrado: ${item.productId}` },
                    { status: 400 }
                );
            }

            // Check Stock
            const quantity = parseInt(item.quantity) || 1;
            if (product.stock < quantity) {
                return NextResponse.json(
                    { error: `Stock insuficiente para: ${product.name}` },
                    { status: 400 }
                );
            }

            // Determine Price (Prioritize USD Sale Price)
            // We use Number() because Prisma returns Decimal
            const basePrice = product.pvpUsd ? Number(product.pvpUsd) : Number(product.price);

            // Apply Markup
            const price = basePrice * markupMultiplier;

            calculatedTotal += price * quantity;

            validItems.push({
                productId: product.id,
                quantity: quantity,
                price: price, // Store the trusted price WITH MARKUP
                title: product.name, // Need title for MP
                description: product.description || product.name, // MP quality score
            });
        }

        // Calculate Shipping
        // For now, based on previous logic, we default to 0 (Pay on Delivery / Calculated elsewhere)
        // Check strictness: if we want to enforce free shipping logic, we should do it here.
        // But for now, let's keep it 0 as per the original code's behavior which trusted client's 0.
        // We will FORCE it to 0 or valid value, not client's value.
        const shippingCost = 0;

        const finalTotal = calculatedTotal + shippingCost;

        // --- END CALCULATION ---

        // Get or create user
        let userId: string;

        if (session?.user?.id) {
            userId = session.user.id as string;
        } else {
            let user = await prisma.user.findUnique({
                where: { email: customerEmail.toLowerCase() }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name: customerName,
                        email: customerEmail.toLowerCase(),
                        role: 'USER',
                        password: '',
                    }
                });
            }
            userId = user.id;
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                userId,
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                shippingProvince,
                shippingCity,
                shippingZip,
                shippingDetails,
                shippingType,
                shippingCost,
                isFreeShipping: isFreeShipping || false, // Should interpret from logic
                shippingMethod: 'Correo Argentino',
                paymentMethod,
                paymentReceiptUrl,
                paymentStatus: 'PENDING',
                status: 'PENDING',
                total: finalTotal, // Use server calculated total
                items: {
                    create: validItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        // Snapshot fields (re-fetch product or use found)
                        // Ideally we already have product info in validItems or can find it again
                        productName: products.find(p => p.id === item.productId)?.name || 'Producto desconocido',
                        productSku: products.find(p => p.id === item.productId)?.sku || 'N/A',
                        productImage: products.find(p => p.id === item.productId)?.imageUrl || null,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        // Update Stock (Simple decrement)
        // Ideally should be a transaction with the order creation, but Prisma doesn't support 
        // nested write with arbitrary logic easily without $transaction interactive.
        // We will do it in parallel for now.
        await Promise.all(validItems.map(item =>
            prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            })
        ));

        // Generate Mercado Pago Preference
        let mpUrl = null;
        if (paymentMethod === 'mercadopago') {
            try {
                // Fetch current exchange rate using the system settings
                // This respects the Manual/Auto setting in the Admin Panel
                const { getExchangeRate } = await import('@/app/actions/settings');
                const { rate: exchangeRate } = await getExchangeRate();

                if (!exchangeRate || exchangeRate <= 0) {
                    throw new Error("Cotización del dólar no configurada o inválida. Configurala en Admin > Configuración.");
                }

                console.log("[MP] Exchange Rate used:", exchangeRate);
                console.log("[MP] Items to convert:", JSON.stringify(validItems.map(i => ({ id: i.productId, priceUsd: i.price, qty: i.quantity }))));

                const mpItems = validItems.map(item => {
                    const priceNum = Number(item.price);
                    const unitPrice = Math.round(priceNum * exchangeRate);
                    console.log(`[MP] Item "${item.title}" - USD: ${priceNum.toFixed(4)} x rate ${exchangeRate} = ARS: ${unitPrice}`);
                    return {
                        id: item.productId,
                        title: item.title,
                        quantity: item.quantity,
                        unit_price: unitPrice // ARS integer
                    };
                });

                mpUrl = await createPreference(mpItems, order.id);
                console.log("[MP] Preference URL generated:", mpUrl);
            } catch (error: any) {
                console.error("[MP] Error creating preference:", error);
                return NextResponse.json(
                    { error: `Error al generar el pago: ${error?.message || 'Error desconocido'}` },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ ...order, url: mpUrl });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Error al crear el pedido' },
            { status: 500 }
        );
    }
}

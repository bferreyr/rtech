import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        const data = await request.json();

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
            shippingCost,
            isFreeShipping,
            paymentMethod,
            paymentReceiptUrl,
            items,
            total,
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

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'El carrito está vacío' },
                { status: 400 }
            );
        }

        // Get or create user
        let userId: string;

        if (session?.user?.id) {
            // User is logged in, use their ID
            userId = session.user.id as string;
        } else {
            // Guest checkout - find or create user by email
            let user = await prisma.user.findUnique({
                where: { email: customerEmail.toLowerCase() }
            });

            if (!user) {
                // Create new user account for guest
                user = await prisma.user.create({
                    data: {
                        name: customerName,
                        email: customerEmail.toLowerCase(),
                        phone: customerPhone,
                        role: 'USER',
                        // No password - user will need to reset password to login
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
                isFreeShipping,
                shippingMethod: 'Correo Argentino',
                paymentMethod,
                paymentReceiptUrl,
                paymentStatus: paymentMethod === 'mercadopago' ? 'PENDING' : 'PENDING',
                status: 'PENDING',
                total,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(order);

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Error al crear el pedido' },
            { status: 500 }
        );
    }
}

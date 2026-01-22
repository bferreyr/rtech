import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Check if products exist
        const count = await prisma.product.count();
        if (count > 0) {
            return NextResponse.json({ message: "Database already seeded", count });
        }

        // Create dummy products
        await prisma.product.createMany({
            data: [
                {
                    sku: "LPT-GAMER-001",
                    codigoProducto: "LPT-GAMER-001",
                    name: "Laptop Gamer Ultra",
                    description: "Potencia sin límites para tus juegos favoritos. RTX 4090, i9 14900HX.",
                    price: 2499.99,
                    precio: 2499.99,
                    stock: 5,
                    stockTotal: 5,
                    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop",
                    imagen: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop",
                    marca: "ASUS ROG",
                    gamer: true
                },
                {
                    sku: "MON-4K144-001",
                    codigoProducto: "MON-4K144-001",
                    name: "Monitor 4K 144Hz",
                    description: "La mejor calidad de imagen con la fluidez que necesitas.",
                    price: 699.00,
                    precio: 699.00,
                    stock: 12,
                    stockTotal: 12,
                    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop",
                    imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop",
                    marca: "LG",
                    gamer: true
                },
                {
                    sku: "KBD-MECH-RGB-001",
                    codigoProducto: "KBD-MECH-RGB-001",
                    name: "Teclado Mecánico RGB",
                    description: "Switches Cherry MX Red y chasis de aluminio.",
                    price: 129.50,
                    precio: 129.50,
                    stock: 25,
                    stockTotal: 25,
                    imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070&auto=format&fit=crop",
                    imagen: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070&auto=format&fit=crop",
                    marca: "Corsair",
                    gamer: true
                },
                {
                    sku: "MSE-WLSS-PRO-001",
                    codigoProducto: "MSE-WLSS-PRO-001",
                    name: "Mouse Wireless Pro",
                    description: "Sensor óptico de 25K DPI y peso ultraligero.",
                    price: 89.99,
                    precio: 89.99,
                    stock: 30,
                    stockTotal: 30,
                    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1928&auto=format&fit=crop",
                    imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1928&auto=format&fit=crop",
                    marca: "Logitech",
                    gamer: true
                }
            ]
        });

        return NextResponse.json({ message: "Seed successful" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
    }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Empezando el sembrado de datos...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // 0. Crear Usuario Admin
    console.log('👤 Creando usuario admin...');
    await prisma.user.upsert({
        where: { email: 'admin@rtech.com' },
        update: {},
        create: {
            email: 'admin@rtech.com',
            name: 'Admin RTECH',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // 1. Limpiar base de datos (Opcional, pero recomendado para semillas limpias)
    // await prisma.orderItem.deleteMany();
    // await prisma.product.deleteMany();
    // await prisma.category.deleteMany();

    // 2. Crear Categorías
    const categories = [
        { name: 'Procesadores', slug: 'procesadores' },
        { name: 'Placas de Video', slug: 'placas-de-video' },
        { name: 'Memoria RAM', slug: 'memoria-ram' },
        { name: 'Almacenamiento', slug: 'almacenamiento' },
        { name: 'Motherboards', slug: 'motherboards' },
        { name: 'Fuentes de Poder', slug: 'fuentes' },
        { name: 'Gabinetes', slug: 'gabinetes' },
    ];

    console.log('📁 Creando categorías...');
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }

    const cats = await prisma.category.findMany();
    const getCatId = (slug: string) => cats.find((c: any) => c.slug === slug)?.id;

    // 3. Crear Productos
    const products = [
        {
            sku: 'CPU-INT-14900K',
            name: 'Intel Core i9-14900K',
            description: 'Procesador de 24 núcleos (8P + 16E) hasta 6.0 GHz para gaming extremo y streaming.',
            price: 589.99,
            stock: 15,
            categoryId: getCatId('procesadores'),
            imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop'
        },
        {
            sku: 'CPU-AMD-7800X3D',
            name: 'AMD Ryzen 7 7800X3D',
            description: 'El procesador gaming más rápido del mundo con tecnología 3D V-Cache.',
            price: 449.99,
            stock: 12,
            categoryId: getCatId('procesadores'),
            imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop'
        },
        {
            sku: 'GPU-NV-RTX4090',
            name: 'NVIDIA GeForce RTX 4090 24GB',
            description: 'La placa de video más potente del mundo con arquitectura Ada Lovelace y DLSS 3.5.',
            price: 1599.99,
            stock: 5,
            categoryId: getCatId('placas-de-video'),
            imageUrl: 'https://images.unsplash.com/photo-1631553127988-348f3dec7f4e?q=80&w=1000&auto=format&fit=crop'
        },
        {
            sku: 'RAM-COR-DDR5-32',
            name: 'Corsair Vengeance RGB 32GB DDR5 6000MHz',
            description: 'Kit de memoria premium con iluminación RGB dinámica y alto rendimiento.',
            price: 124.99,
            stock: 10,
            categoryId: getCatId('memoria-ram'),
            imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=1000&auto=format&fit=crop'
        },
        {
            sku: 'SSD-SAM-990PRO-2TB',
            name: 'Samsung 990 Pro 2TB NVMe Gen4',
            description: 'SSD de alto rendimiento con velocidades de lectura de hasta 7450 MB/s.',
            price: 189.99,
            stock: 45,
            categoryId: getCatId('almacenamiento'),
            imageUrl: 'https://images.unsplash.com/photo-1597872200919-012b9c74b710?q=80&w=1000&auto=format&fit=crop'
        },
        {
            sku: 'MB-ASUS-Z790',
            name: 'ASUS ROG Maximus Z790 Hero',
            description: 'Motherboard premium para Intel 14va Gen con WiFi 6E y soporte DDR5.',
            price: 629.99,
            stock: 8,
            categoryId: getCatId('motherboards'),
            imageUrl: 'https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=1000&auto=format&fit=crop'
        },
        {
            sku: 'PSU-COR-RM1000X',
            name: 'Corsair RM1000x 1000W Gold',
            description: 'Fuente de poder modular de 1000W con certificación 80 Plus Gold.',
            price: 189.99,
            stock: 15,
            categoryId: getCatId('fuentes'),
            imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop'
        },
        {
            sku: 'CASE-NZXT-H7-FLOW',
            name: 'NZXT H7 Flow Black',
            description: 'Gabinete Mid-Tower con excelente flujo de aire y diseño minimalista.',
            price: 129.99,
            stock: 10,
            categoryId: getCatId('gabinetes'),
            imageUrl: 'https://images.unsplash.com/photo-1547078501-111c82ec1512?q=80&w=1000&auto=format&fit=crop'
        }
    ];

    console.log('🎮 Creando productos...');
    for (const prod of products) {
        await prisma.product.upsert({
            where: { sku: prod.sku },
            update: prod,
            create: prod,
        });
    }

    console.log('✅ Sembrado completado con éxito.');
}

main()
    .catch((e) => {
        console.error('❌ Error en el sembrado:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

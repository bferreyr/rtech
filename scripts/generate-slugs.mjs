import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Fetching products...");
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products. Generating slugs...`);

    let updatedCount = 0;

    for (const p of products) {
        // Base slug from name
        let baseSlug = p.name
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
            .replace(/(^-|-$)+/g, ''); // Trim dashes
        
        if (!baseSlug) baseSlug = p.sku.toLowerCase();

        let slug = baseSlug;
        let counter = 1;

        // Check for collisions (if another product has this slug)
        while (true) {
            const exists = await prisma.product.findUnique({ where: { slug } });
            if (!exists || exists.id === p.id) {
                break;
            }
            // If it exists, append SKU to make it unique easily (or a counter)
            slug = `${baseSlug}-${p.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            
            // If even with SKU it exists (very unlikely unless identical SKUs), use counter
            const existsWithSku = await prisma.product.findUnique({ where: { slug } });
            if (!existsWithSku || existsWithSku.id === p.id) break;
            
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        await prisma.product.update({
            where: { id: p.id },
            data: { slug }
        });
        
        updatedCount++;
        if (updatedCount % 50 === 0) {
            console.log(`Updated ${updatedCount} products...`);
        }
    }

    console.log(`✅ Successfully generated slugs for ${updatedCount} products.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

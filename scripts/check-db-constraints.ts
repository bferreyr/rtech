import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkConstraints() {
    try {
        console.log("Checking DB constraints...");

        const productCount = await prisma.product.count();
        console.log(`Total Products: ${productCount}`);

        const orderItemCount = await prisma.orderItem.count();
        console.log(`Total OrderItems: ${orderItemCount}`);

        const productsInOrders = await prisma.product.count({
            where: {
                items: {
                    some: {}
                }
            }
        });
        console.log(`Products in Orders (Cannot be deleted easily): ${productsInOrders}`);

        // Check for reviews?
        const reviewCount = await prisma.review.count();
        console.log(`Total Reviews: ${reviewCount}`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkConstraints();

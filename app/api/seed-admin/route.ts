import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        // Check if admin exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@rtech.com' }
        });

        if (existingAdmin) {
            return NextResponse.json({ message: "Admin user already exists" });
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        await prisma.user.create({
            data: {
                email: 'admin@rtech.com',
                password: hashedPassword,
                name: 'Administrador',
                role: 'ADMIN',
                isBlocked: false,
                canPurchase: true
            }
        });

        return NextResponse.json({ message: "Admin user created successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
    }
}

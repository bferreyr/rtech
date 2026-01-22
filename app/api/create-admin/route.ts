import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        // Check if admin exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: "admin@rtech.com" }
        });

        if (existingAdmin) {
            return NextResponse.json({
                message: "Admin user already exists",
                email: "admin@rtech.com"
            });
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = await prisma.user.create({
            data: {
                name: "Admin",
                email: "admin@rtech.com",
                password: hashedPassword,
                role: "ADMIN",
                points: 0
            }
        });

        return NextResponse.json({
            message: "Admin user created successfully",
            email: admin.email,
            password: "admin123"
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
    }
}

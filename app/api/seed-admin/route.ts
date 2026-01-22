import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Check if admin exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@rtech.com' }
        });

        if (existingAdmin) {
            return NextResponse.json({ message: "Admin user already exists" });
        }

        // Create admin user
        // NOTA: En producción, NUNCA guardar contraseñas en texto plano. Usar bcrypt/argon2.
        // Para este MVP local usaremos texto plano por simplicidad como solicitado, 
        // pero dejaré una nota de seguridad.
        await prisma.user.create({
            data: {
                email: 'admin@rtech.com',
                // Password simple para desarrollo local
                password: 'admin123',
                name: 'Administrador',
                role: 'ADMIN'
            }
        });

        return NextResponse.json({ message: "Admin user created successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
    }
}

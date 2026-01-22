'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function getUsers() {
    try {
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { orders: true }
                }
            }
        })
    } catch (error) {
        console.error("Error fetching users:", error)
        return []
    }
}

export async function createUser(data: any) {
    try {
        const { email, password, name, role, points } = data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role || 'USER',
                points: points || 0,
                isBlocked: false,
                canPurchase: true
            }
        });

        revalidatePath("/admin/users");
        revalidatePath("/profile");
        return { success: true, user };
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: "Error al crear el usuario" };
    }
}

export async function updateUser(userId: string, data: any) {
    try {
        const { email, name, role, points, password } = data;

        const updateData: any = {
            email,
            name,
            role,
            points
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        revalidatePath("/admin/users");
        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, error: "Error al actualizar el usuario" };
    }
}

export async function toggleUserBlock(userId: string) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw new Error("User not found")

        await prisma.user.update({
            where: { id: userId },
            data: { isBlocked: !user.isBlocked }
        })

        revalidatePath("/admin/users")
        revalidatePath("/profile")
        return { success: true }
    } catch (error) {
        console.error("Error toggling user block:", error)
        return { success: false, error: "Error al cambiar estado de bloqueo" }
    }
}

export async function toggleUserPurchase(userId: string) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw new Error("User not found")

        await prisma.user.update({
            where: { id: userId },
            data: { canPurchase: !user.canPurchase }
        })

        revalidatePath("/admin/users")
        revalidatePath("/profile")
        return { success: true }
    } catch (error) {
        console.error("Error toggling user purchase:", error)
        return { success: false, error: "Error al cambiar permisos de compra" }
    }
}

export async function adjustUserPoints(userId: string, amount: number, description: string) {
    try {
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { points: { increment: amount } }
            }),
            prisma.pointHistory.create({
                data: {
                    userId,
                    amount,
                    type: 'ADMIN_ADJUSTMENT',
                    description
                }
            })
        ])

        revalidatePath("/admin/users")
        revalidatePath("/profile")
        return { success: true }
    } catch (error) {
        console.error("Error adjusting points:", error)
        return { success: false, error: "Error al ajustar puntos" }
    }
}

export async function getUserPoints(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { points: true }
        })
        return user?.points || 0
    } catch (error) {
        console.error("Error fetching user points:", error)
        return 0
    }
}

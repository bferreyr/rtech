'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Email y contraseña son requeridos" }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { error: "El email ya está registrado" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER"
            }
        })
    } catch (error) {
        console.error("Registration error:", error)
        return { error: "Error al registrar el usuario" }
    }

    // Auto login after registration
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/profile"
        })
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Error al iniciar sesión automáticamente" }
        }
        throw error // Re-throw redirect errors
    }

    return { success: true }
}

export async function logoutUser() {
    await signOut({ redirectTo: "/login" })
}

export async function loginUser(prevState: any, formData: FormData) {
    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales inválidas" }
                default:
                    return { error: "Algo salió mal" }
            }
        }
        return { error: "Error al iniciar sesión" }
    }
}

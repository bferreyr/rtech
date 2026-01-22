import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")

    if (isOnAdmin && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl))
    }

    if (isOnAdmin && req.auth?.user && (req.auth.user as any).role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/admin/:path*", "/profile/:path*"],
}

import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    providers: [],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id as string;
                token.points = (user as any).points;
                token.isBlocked = (user as any).isBlocked;
                token.canPurchase = (user as any).canPurchase;
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).points = token.points;
                (session.user as any).isBlocked = token.isBlocked;
                (session.user as any).canPurchase = token.canPurchase;
            }
            return session
        }
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig

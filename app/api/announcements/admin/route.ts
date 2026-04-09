import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ─── GET /api/announcements/admin — todos (activos e inactivos) ───────────────
export async function GET() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const announcements = await prisma.announcement.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(announcements);
}

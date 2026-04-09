import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ─── GET /api/announcements — público, devuelve anuncios activos ───────────────
export async function GET() {
    const now = new Date();

    const announcements = await prisma.announcement.findMany({
        where: {
            active: true,
            OR: [
                { startsAt: null },
                { startsAt: { lte: now } },
            ],
            AND: [
                {
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gte: now } },
                    ],
                },
            ],
        },
        orderBy: { order: "asc" },
    });

    return NextResponse.json(announcements);
}

// ─── POST /api/announcements — solo admin ─────────────────────────────────────
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { title, subtitle, type, active, startsAt, expiresAt, order } = body;

    if (!title || !type) {
        return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
        data: {
            title,
            subtitle: subtitle || null,
            type,
            active: active ?? true,
            startsAt: startsAt ? new Date(startsAt) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            order: order ?? 0,
        },
    });

    return NextResponse.json(announcement, { status: 201 });
}

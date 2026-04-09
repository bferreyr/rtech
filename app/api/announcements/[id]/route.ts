import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

// ─── PUT /api/announcements/[id] ──────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, subtitle, type, active, startsAt, expiresAt, order } = body;

    const announcement = await prisma.announcement.update({
        where: { id },
        data: {
            title,
            subtitle: subtitle || null,
            type,
            active,
            startsAt: startsAt ? new Date(startsAt) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            order: order ?? 0,
        },
    });

    return NextResponse.json(announcement);
}

// ─── DELETE /api/announcements/[id] ───────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

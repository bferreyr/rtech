'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function getCarouselSlides() {
    const slides = await prisma.carouselSlide.findMany({
        orderBy: { order: 'asc' },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    sku: true,
                    stockTotal: true,
                    imageUrl: true // Fallback image
                }
            }
        }
    });

    return slides.map(slide => ({
        ...slide,
        priceArs: slide.priceArs !== null ? Number(slide.priceArs) : null,
        priceUsd: slide.priceUsd !== null ? Number(slide.priceUsd) : null,
        product: {
            ...slide.product,
            price: Number(slide.product.price)
        }
    }));
}

export async function getCarouselSlide(id: string) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") return null;

    return await prisma.carouselSlide.findUnique({
        where: { id },
        include: { product: true }
    });
}

export async function createCarouselSlide(formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    const productId = formData.get('productId') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const title = formData.get('title') as string || null;
    const priceArs = formData.get('priceArs') ? parseFloat(formData.get('priceArs') as string) : null;
    const priceUsd = formData.get('priceUsd') ? parseFloat(formData.get('priceUsd') as string) : null;
    const active = formData.get('active') === 'true';

    // Get max order to append to end
    const lastSlide = await prisma.carouselSlide.findFirst({
        orderBy: { order: 'desc' }
    });
    const order = (lastSlide?.order ?? -1) + 1;

    await prisma.carouselSlide.create({
        data: {
            productId,
            imageUrl,
            title,
            priceArs,
            priceUsd,
            active,
            order
        }
    });

    revalidatePath('/admin/offers');
    revalidatePath('/');
    redirect('/admin/offers');
}

export async function updateCarouselSlide(id: string, formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    const productId = formData.get('productId') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const title = formData.get('title') as string || null;
    const priceArs = formData.get('priceArs') ? parseFloat(formData.get('priceArs') as string) : null;
    const priceUsd = formData.get('priceUsd') ? parseFloat(formData.get('priceUsd') as string) : null;
    const active = formData.get('active') === 'true';

    await prisma.carouselSlide.update({
        where: { id },
        data: {
            productId,
            imageUrl,
            title,
            priceArs,
            priceUsd,
            active
        }
    });

    revalidatePath('/admin/offers');
    revalidatePath('/');
    redirect('/admin/offers');
}

export async function deleteCarouselSlide(id: string) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    await prisma.carouselSlide.delete({
        where: { id }
    });

    revalidatePath('/admin/offers');
    revalidatePath('/');
}

export async function toggleCarouselSlide(id: string, active: boolean) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    await prisma.carouselSlide.update({
        where: { id },
        data: { active }
    });

    revalidatePath('/admin/offers');
    revalidatePath('/');
}

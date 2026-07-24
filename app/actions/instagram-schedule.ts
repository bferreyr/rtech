'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createSchedule(data: {
    cronExpression?: string;
    specificDate?: Date;
    startDate?: Date;
    endDate?: Date;
    postType: string;
}) {
    try {
        await prisma.instagramSchedule.create({
            data: {
                cronExpression: data.cronExpression,
                specificDate: data.specificDate,
                startDate: data.startDate,
                endDate: data.endDate,
                postType: data.postType,
                isActive: true
            }
        });
        revalidatePath('/admin/instagram');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteSchedule(id: string) {
    try {
        await prisma.instagramSchedule.delete({ where: { id } });
        revalidatePath('/admin/instagram');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function toggleSchedule(id: string, isActive: boolean) {
    try {
        await prisma.instagramSchedule.update({
            where: { id },
            data: { isActive }
        });
        revalidatePath('/admin/instagram');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

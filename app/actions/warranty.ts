'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { WarrantyType, WarrantyStatus } from '@prisma/client';

export type WarrantyInput = {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    type: WarrantyType;
    productSku: string;
    serialNumber: string;
    problemDescription: string;
    invoiceDate?: Date | null;
};

export async function createWarrantyRequest(data: WarrantyInput) {
    try {
        const warranty = await prisma.warrantyRequest.create({
            data: {
                contactName: data.contactName,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
                type: data.type,
                productSku: data.productSku,
                serialNumber: data.serialNumber,
                problemDescription: data.problemDescription,
                invoiceDate: data.invoiceDate,
                status: 'PENDING',
            },
        });

        // revalidate paths if necessary
        revalidatePath('/admin/warranty');

        return { success: true, warranty };
    } catch (error) {
        console.error('Error creating warranty request:', error);
        return { success: false, error: 'Hubo un error al crear la solicitud de garantía.' };
    }
}

export async function getWarrantyRequests(status?: WarrantyStatus) {
    try {
        const warranties = await prisma.warrantyRequest.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, warranties };
    } catch (error) {
        console.error('Error fetching warranty requests:', error);
        return { success: false, error: 'Hubo un error al obtener las solicitudes.', warranties: [] };
    }
}

export async function updateWarrantyStatus(id: string, status: WarrantyStatus, notes?: string) {
    try {
        const updated = await prisma.warrantyRequest.update({
            where: { id },
            data: {
                status,
                ...(notes !== undefined ? { notes } : {}),
            },
        });

        revalidatePath('/admin/warranty');
        return { success: true, warranty: updated };
    } catch (error) {
        console.error('Error updating warranty status:', error);
        return { success: false, error: 'Hubo un error al actualizar el estado.' };
    }
}

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';

/**
 * Upload a 3D model and create a printing job record
 */
export async function upload3DModel(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;

        if (!file || !userId || !title) {
            return { success: false, error: 'Faltan campos requeridos' };
        }

        // Validate file type
        const isStl = file.name.toLowerCase().endsWith('.stl');
        const isGlb = file.name.toLowerCase().endsWith('.glb');
        const isGltf = file.name.toLowerCase().endsWith('.gltf');

        if (!isStl && !isGlb && !isGltf) {
            return { success: false, error: 'Formato de archivo no soportado. Use .stl, .glb o .gltf' };
        }

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads', '3d-models');
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const uniqueId = uuidv4();
        const extension = file.name.split('.').pop();
        const storedFileName = `${uniqueId}.${extension}`;
        const filePath = join(uploadDir, storedFileName);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Create DB record
        const job = await (prisma as any).printingJob.create({
            data: {
                userId,
                title,
                description,
                fileName: file.name,
                fileUrl: `/uploads/3d-models/${storedFileName}`,
                price: price ? parseFloat(price) : null,
                status: 'PENDING'
            }
        });

        revalidatePath('/admin/3d-printing');
        revalidatePath(`/profile/3d-models`);

        return { success: true, job };
    } catch (error) {
        console.error('Error uploading 3D model:', error);
        return { success: false, error: 'Error al subir el modelo' };
    }
}

/**
 * Get all 3D printing jobs (for admin)
 */
export async function getPrintingJobs() {
    try {
        const jobs = await (prisma as any).printingJob.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return jobs;
    } catch (error) {
        console.error('Error getting printing jobs:', error);
        return [];
    }
}

/**
 * Get user's printing jobs
 */
export async function getUserPrintingJobs(userId: string) {
    try {
        const jobs = await (prisma as any).printingJob.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return jobs;
    } catch (error) {
        console.error('Error getting user jobs:', error);
        return [];
    }
}

/**
 * Get single job by ID
 */
export async function getPrintingJob(id: string) {
    try {
        const job = await (prisma as any).printingJob.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        return job;
    } catch (error) {
        console.error('Error getting job:', error);
        return null;
    }
}

/**
 * Update job status or price
 */
export async function updatePrintingJob(id: string, data: { status?: string, price?: number }) {
    try {
        await (prisma as any).printingJob.update({
            where: { id },
            data: {
                ...(data.status && { status: data.status as any }),
                ...(data.price !== undefined && { price: data.price })
            }
        });

        revalidatePath('/admin/3d-printing');
        return { success: true };
    } catch (error) {
        console.error('Error updating job:', error);
        return { success: false, error: 'Error al actualizar el trabajo' };
    }
}

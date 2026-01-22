'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as XLSX from 'xlsx';

export async function bulkUploadCategories(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No se subió ningún archivo');

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    let created = 0;
    let skipped = 0;

    for (const row of data) {
        // Support both 'categoria' and 'name' column names
        const categoryName = row.categoria || row.name || row.Categoria || row.Name;

        if (!categoryName || typeof categoryName !== 'string') {
            skipped++;
            continue;
        }

        const name = String(categoryName).trim();
        if (!name) {
            skipped++;
            continue;
        }

        const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        try {
            // Check if category already exists
            const existing = await prisma.category.findUnique({
                where: { slug }
            });

            if (existing) {
                skipped++;
                continue;
            }

            await prisma.category.create({
                data: { name, slug }
            });
            created++;
        } catch (error) {
            console.error(`Error creating category "${name}":`, error);
            skipped++;
        }
    }

    revalidatePath('/admin/categories');
    revalidatePath('/products');
    revalidatePath('/');

    return {
        success: true,
        created,
        skipped,
        total: data.length
    };
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('receipt') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó ningún archivo' },
                { status: 400 }
            );
        }

        // Validate file type and get extension
        const mimeToExt: Record<string, string> = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'application/pdf': 'pdf'
        };

        const extension = mimeToExt[file.type];
        if (!extension) {
            return NextResponse.json(
                { error: 'Tipo de archivo no válido. Solo se permiten JPG, PNG o PDF' },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'El archivo no puede superar los 5MB' },
                { status: 400 }
            );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'receipts');
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Generate unique and safe filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const filename = `receipt-${timestamp}-${random}.${extension}`;
        const filepath = join(uploadsDir, filename);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/receipts/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename
        });

    } catch (error) {
        console.error('Error uploading receipt:', error);
        return NextResponse.json(
            { error: 'Error al subir el archivo' },
            { status: 500 }
        );
    }
}

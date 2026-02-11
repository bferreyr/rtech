'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface ReceiptUploadProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export function ReceiptUpload({ onFileSelect, selectedFile }: ReceiptUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFile = (file: File) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Por favor sube un archivo JPG, PNG o PDF');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo no puede superar los 5MB');
            return;
        }

        onFileSelect(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleRemove = () => {
        onFileSelect(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {!selectedFile ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragging
                            ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                            : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--accent-primary))]/50'
                        }`}
                >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--text-secondary))]" />
                    <p className="text-sm font-medium mb-1">
                        Arrastra tu comprobante aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-[hsl(var(--text-secondary))]">
                        JPG, PNG o PDF (máx. 5MB)
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="border border-[hsl(var(--border-color))] rounded-lg p-4">
                    <div className="flex items-start gap-4">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-[hsl(var(--bg-tertiary))] rounded flex items-center justify-center">
                                <FileText className="w-8 h-8 text-[hsl(var(--text-secondary))]" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{selectedFile.name}</p>
                            <p className="text-sm text-[hsl(var(--text-secondary))]">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-red-400" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

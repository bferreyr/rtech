import { createProduct } from "@/app/actions/products";
import { ProductForm } from "../_components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6">
            <Link href="/admin/products" className="flex items-center text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Volver al listado
            </Link>

            <div>
                <h1 className="text-3xl font-bold">Nuevo Producto</h1>
                <p className="text-[color:var(--text-secondary)]">Añade un nuevo item a tu catálogo.</p>
            </div>

            <ProductForm action={createProduct} categories={categories} />
        </div>
    );
}

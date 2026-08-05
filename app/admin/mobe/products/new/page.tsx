import { createProduct } from "@/app/actions/products";
import { ProductForm } from "../../../products/_components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function NewMobeProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    const actionWithProvider = async (formData: FormData) => {
        "use server";
        formData.set("provider", "MOBE");
        return createProduct(formData);
    };

    return (
        <div className="space-y-6">
            <Link href="/admin/mobe/products" className="flex items-center text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Volver al listado MOBE
            </Link>

            <div>
                <h1 className="text-3xl font-bold">Nuevo Producto MOBE</h1>
                <p className="text-[color:var(--text-secondary)]">Añade un nuevo item manual a tu catálogo (proveedor MOBE).</p>
            </div>

            <ProductForm action={actionWithProvider} categories={categories} />
        </div>
    );
}

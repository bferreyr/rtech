import { updateProduct } from "@/app/actions/products";
import { ProductForm } from "../../_components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function EditProductPage({ params }: Props) {
    const { id } = await params;

    // Fetch product to edit
    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        notFound();
    }

    // Bind ID to update action
    const updateAction = updateProduct.bind(null, id);

    // Fetch categories for the select field
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6">
            <Link href="/admin/products" className="flex items-center text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Volver al listado
            </Link>

            <div>
                <h1 className="text-3xl font-bold">Editar Producto</h1>
                <p className="text-[color:var(--text-secondary)]">Modificando: {product.name}</p>
            </div>

            <ProductForm
                action={updateAction}
                categories={categories}
                initialData={{
                    sku: product.sku,
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                    categoryId: product.categoryId
                }}
            />
        </div>
    );
}

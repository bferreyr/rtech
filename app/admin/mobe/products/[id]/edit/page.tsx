import { updateProduct } from "@/app/actions/products";
import { ProductForm } from "../../../../products/_components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditMobeProductPage({ params }: Props) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { order: 'asc' } } }
    });

    if (!product) {
        notFound();
    }

    const actionWithProvider = async (formData: FormData) => {
        "use server";
        formData.set("provider", "MOBE");
        return updateProduct(id, formData);
    };

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6">
            <Link href="/admin/mobe/products" className="flex items-center text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Volver al listado MOBE
            </Link>

            <div>
                <h1 className="text-3xl font-bold">Editar Producto MOBE</h1>
                <p className="text-[color:var(--text-secondary)]">Modificando: {product.name}</p>
            </div>

            <ProductForm
                action={actionWithProvider}
                categories={categories}
                initialData={{
                    sku: product.sku,
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                    categoryId: product.categoryId,
                    additionalImages: product.images.map(img => ({ url: img.url })),
                }}
            />
        </div>
    );
}

import { OfferForm } from "../_components/OfferForm";
import { getCarouselSlide } from "@/app/actions/carousel";
import { notFound } from "next/navigation";

export default async function EditOfferPage({ params }: { params: { id: string } }) {
    const slide = await getCarouselSlide(params.id);

    if (!slide) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Editar Oferta</h1>
            <OfferForm initialData={slide} isEditing />
        </div>
    );
}

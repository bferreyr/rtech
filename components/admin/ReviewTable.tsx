'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/Table';
import { StarRating } from '@/components/product/StarRating';
import { Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    title: string;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        email: string | null;
    };
    product: {
        id: string;
        name: string;
    };
}

export function ReviewTable() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const offset = (page - 1) * 20; // 20 items per page for admin
            const response = await fetch(`/api/reviews?limit=20&offset=${offset}`);
            const data = await response.json();

            if (data.reviews) {
                setReviews(data.reviews);
                setTotalPages(Math.ceil(data.totalCount / 20));
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page]);

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/reviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: !currentStatus }),
            });

            if (response.ok) {
                setReviews(reviews.map(r =>
                    r.id === id ? { ...r, isApproved: !currentStatus } : r
                ));
            }
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta reseña?')) return;

        try {
            const response = await fetch(`/api/reviews/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setReviews(reviews.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    if (loading && reviews.length === 0) {
        return <div className="p-8 text-center text-gray-400">Cargando reseñas...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-[color:var(--border-color)] hover:bg-transparent">
                            <TableHead className="text-[color:var(--text-secondary)]">Producto</TableHead>
                            <TableHead className="text-[color:var(--text-secondary)]">Usuario</TableHead>
                            <TableHead className="text-[color:var(--text-secondary)]">Calificación</TableHead>
                            <TableHead className="text-[color:var(--text-secondary)]">Comentario</TableHead>
                            <TableHead className="text-[color:var(--text-secondary)]">Estado</TableHead>
                            <TableHead className="text-[color:var(--text-secondary)]">Fecha</TableHead>
                            <TableHead className="text-[color:var(--text-secondary)] text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow key={review.id} className="border-b-[color:var(--border-color)] hover:bg-[color:var(--bg-primary)]/50">
                                <TableCell className="font-medium max-w-[200px] truncate" title={review.product.name}>
                                    {review.product.name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{review.user.name || 'Anónimo'}</span>
                                        <span className="text-xs text-[color:var(--text-tertiary)]">{review.user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StarRating rating={review.rating} readonly size="sm" />
                                </TableCell>
                                <TableCell className="max-w-[300px]">
                                    <div className="font-medium truncate">{review.title}</div>
                                    <div className="text-xs text-[color:var(--text-tertiary)] truncate">{review.comment}</div>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${review.isApproved
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        }`}>
                                        {review.isApproved ? 'Aprobado' : 'Pendiente'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-xs text-[color:var(--text-tertiary)]">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => toggleApproval(review.id, review.isApproved)}
                                            className={`p-1.5 rounded-lg transition-colors ${review.isApproved
                                                ? 'text-yellow-400 hover:bg-yellow-500/10'
                                                : 'text-green-400 hover:bg-green-500/10'
                                                }`}
                                            title={review.isApproved ? 'Desaprobar' : 'Aprobar'}
                                        >
                                            {review.isApproved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => deleteReview(review.id)}
                                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded border border-[color:var(--border-color)] disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1">Página {page} de {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded border border-[color:var(--border-color)] disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

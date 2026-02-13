'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';

interface ReviewFormProps {
    productId: string;
    onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    title,
                    comment,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit review');
            }

            setSuccess(true);
            setTitle('');
            setComment('');
            setRating(5);

            if (onSuccess) {
                onSuccess();
            }

            // Auto-hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] p-6 backdrop-blur-xl">
            <h3 className="text-xl font-bold mb-4">Escribir una Reseña</h3>

            {success && (
                <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                    ¡Gracias por tu reseña! Se ha publicado correctamente.
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                        Calificación *
                    </label>
                    <StarRating rating={rating} onChange={setRating} size="lg" />
                </div>

                {/* Title */}
                <div>
                    <label
                        htmlFor="review-title"
                        className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2"
                    >
                        Título de la Reseña *
                    </label>
                    <input
                        id="review-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        required
                        placeholder="Resumen de tu experiencia"
                        className="w-full px-4 py-2 rounded-lg bg-[color:var(--bg-primary)] border border-[color:var(--border-color)] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]"
                    />
                    <p className="text-xs text-[color:var(--text-tertiary)] mt-1">
                        {title.length}/100 caracteres
                    </p>
                </div>

                {/* Comment */}
                <div>
                    <label
                        htmlFor="review-comment"
                        className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2"
                    >
                        Tu Reseña *
                    </label>
                    <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={1000}
                        required
                        rows={5}
                        placeholder="Cuéntanos sobre tu experiencia con este producto..."
                        className="w-full px-4 py-2 rounded-lg bg-[color:var(--bg-primary)] border border-[color:var(--border-color)] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] resize-none"
                    />
                    <p className="text-xs text-[color:var(--text-tertiary)] mt-1">
                        {comment.length}/1000 caracteres
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !title || !comment}
                    className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
                </button>
            </form>
        </div>
    );
}

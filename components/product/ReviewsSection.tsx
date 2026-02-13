'use client';

import { useState, useEffect } from 'react';
import { ReviewStats } from './ReviewStats';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';
import { useSession } from 'next-auth/react';

interface ReviewsSectionProps {
    productId: string;
}

interface Review {
    id: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
    };
}

interface ReviewData {
    reviews: Review[];
    totalCount: number;
    stats: {
        totalReviews: number;
        averageRating: number;
        distribution: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    } | null;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
    const { data: session } = useSession();
    const [reviewData, setReviewData] = useState<ReviewData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    const fetchReviews = async (page: number = 1) => {
        try {
            setLoading(true);
            const offset = (page - 1) * 10;
            const response = await fetch(
                `/api/reviews?productId=${productId}&limit=10&offset=${offset}`
            );
            const data = await response.json();
            setReviewData(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkCanReview = async () => {
        if (!session?.user) {
            setCanReview(false);
            return;
        }

        try {
            // Check if user has already reviewed
            const response = await fetch(
                `/api/reviews?productId=${productId}&userId=${session.user.id}`
            );
            const data = await response.json();

            if (data.reviews && data.reviews.length > 0) {
                setHasReviewed(true);
                setCanReview(false);
                return;
            }

            // Check if user has purchased (this will be validated on the backend too)
            // For now, we'll allow the form to show and let the backend handle validation
            setCanReview(true);
        } catch (error) {
            console.error('Error checking review status:', error);
            setCanReview(false);
        }
    };

    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage, productId]);

    useEffect(() => {
        checkCanReview();
    }, [session, productId]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleReviewSuccess = () => {
        setHasReviewed(true);
        setCanReview(false);
        fetchReviews(1);
        setCurrentPage(1);
    };

    if (loading && !reviewData) {
        return (
            <div className="py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-48 bg-[color:var(--bg-secondary)] rounded-xl" />
                    <div className="h-32 bg-[color:var(--bg-secondary)] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Review Stats */}
            {reviewData?.stats && reviewData.stats.totalReviews > 0 && (
                <ReviewStats
                    averageRating={reviewData.stats.averageRating}
                    totalReviews={reviewData.stats.totalReviews}
                    distribution={reviewData.stats.distribution}
                />
            )}

            {/* Review Form */}
            {session?.user && canReview && !hasReviewed && (
                <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
            )}

            {session?.user && hasReviewed && (
                <div className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] p-6 text-center">
                    <p className="text-[color:var(--text-secondary)]">
                        Ya has dejado una reseña para este producto. ¡Gracias por tu opinión!
                    </p>
                </div>
            )}

            {!session?.user && (
                <div className="rounded-xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)] p-6 text-center">
                    <p className="text-[color:var(--text-secondary)]">
                        <a href="/login" className="text-[hsl(var(--accent-primary))] hover:underline">
                            Inicia sesión
                        </a>{' '}
                        para dejar una reseña
                    </p>
                </div>
            )}

            {/* Review List */}
            <div>
                <h3 className="text-2xl font-bold mb-6">
                    Reseñas de Clientes
                    {reviewData?.totalCount ? ` (${reviewData.totalCount})` : ''}
                </h3>
                {reviewData && (
                    <ReviewList
                        reviews={reviewData.reviews}
                        totalCount={reviewData.totalCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

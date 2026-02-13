import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login to submit a review.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { productId, rating, title, comment, orderId } = body;

        // Validation
        if (!productId || !rating || !title || !comment) {
            return NextResponse.json(
                { error: 'Missing required fields: productId, rating, title, comment' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        if (title.length > 100) {
            return NextResponse.json(
                { error: 'Title must be 100 characters or less' },
                { status: 400 }
            );
        }

        if (comment.length > 1000) {
            return NextResponse.json(
                { error: 'Comment must be 1000 characters or less' },
                { status: 400 }
            );
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if user has purchased this product (verified purchase)
        let isVerifiedPurchase = false;
        let verifiedOrderId = null;

        if (orderId) {
            // Check if the provided order exists and belongs to the user
            const order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    userId: session.user.id,
                    status: 'DELIVERED',
                    items: {
                        some: {
                            productId: productId,
                        },
                    },
                },
            });

            if (order) {
                isVerifiedPurchase = true;
                verifiedOrderId = orderId;
            }
        } else {
            // Auto-detect if user has purchased this product
            const purchasedOrder = await prisma.order.findFirst({
                where: {
                    userId: session.user.id,
                    status: 'DELIVERED',
                    items: {
                        some: {
                            productId: productId,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            if (purchasedOrder) {
                isVerifiedPurchase = true;
                verifiedOrderId = purchasedOrder.id;
            }
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: {
                productId: productId,
                userId: session.user.id,
            },
        });

        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already reviewed this product' },
                { status: 400 }
            );
        }

        // Create the review
        const review = await prisma.review.create({
            data: {
                productId,
                userId: session.user.id!,
                orderId: verifiedOrderId,
                rating,
                title,
                comment,
                isVerifiedPurchase,
                isApproved: true, // Auto-approve by default
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        );
    }
}

// GET /api/reviews - Fetch reviews with filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = {
            isApproved: true, // Only show approved reviews to public
        };

        if (productId) {
            where.productId = productId;
        }

        if (userId) {
            where.userId = userId;
        }

        // Fetch reviews
        const [reviews, totalCount] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                skip: offset,
            }),
            prisma.review.count({ where }),
        ]);

        // Calculate aggregate stats if filtering by productId
        let stats = null;
        if (productId) {
            const allReviews = await prisma.review.findMany({
                where: { productId, isApproved: true },
                select: { rating: true },
            });

            const totalReviews = allReviews.length;
            const averageRating = totalReviews > 0
                ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
                : 0;

            // Rating distribution
            const distribution = {
                5: allReviews.filter(r => r.rating === 5).length,
                4: allReviews.filter(r => r.rating === 4).length,
                3: allReviews.filter(r => r.rating === 3).length,
                2: allReviews.filter(r => r.rating === 2).length,
                1: allReviews.filter(r => r.rating === 1).length,
            };

            stats = {
                totalReviews,
                averageRating: parseFloat(averageRating.toFixed(1)),
                distribution,
            };
        }

        return NextResponse.json({
            reviews,
            totalCount,
            stats,
            pagination: {
                limit,
                offset,
                hasMore: offset + limit < totalCount,
            },
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

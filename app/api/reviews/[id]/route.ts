import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

// DELETE /api/reviews/[id] - Delete a review (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const review = await prisma.review.findUnique({
            where: { id },
        });

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        await prisma.review.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Review deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        );
    }
}

// PATCH /api/reviews/[id] - Update review approval status (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { isApproved } = body;

        if (typeof isApproved !== 'boolean') {
            return NextResponse.json(
                { error: 'isApproved must be a boolean' },
                { status: 400 }
            );
        }

        const review = await prisma.review.findUnique({
            where: { id },
        });

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: { isApproved },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedReview, { status: 200 });
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
            { error: 'Failed to update review' },
            { status: 500 }
        );
    }
}

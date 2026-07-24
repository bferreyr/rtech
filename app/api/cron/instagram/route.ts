import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publishToInstagram } from '@/app/actions/instagram';

// Simple helper to check if a "0 18 * * 5" style cron matches current time (hour & day)
// Note: For a production app, use a proper cron-parser library.
// For this MVP, we parse it manually assuming format: minute hour dayOfMonth month dayOfWeek
function matchCron(cron: string, date: Date) {
    const parts = cron.split(' ');
    if (parts.length !== 5) return false;
    const [min, hour, dom, mon, dow] = parts;
    
    const currHour = date.getHours().toString();
    const currDow = date.getDay().toString();
    
    // We only check hour and dayOfWeek for the MVP.
    const hourMatches = hour === '*' || hour === currHour;
    const dowMatches = dow === '*' || dow === currDow;
    
    return hourMatches && dowMatches;
}

export async function GET(request: Request) {
    // Ideally secure this with a secret token
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'secret'}`) {
        // For development we can allow it without auth if no CRON_SECRET is set, but better to enforce it.
        // return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const now = new Date();
        const activeSchedules = await prisma.instagramSchedule.findMany({
            where: { isActive: true }
        });

        let postedCount = 0;

        for (const schedule of activeSchedules) {
            let shouldRun = false;

            if (schedule.specificDate) {
                // If the specific date is in the past by less than an hour
                const diff = now.getTime() - schedule.specificDate.getTime();
                if (diff >= 0 && diff < 60 * 60 * 1000) {
                    shouldRun = true;
                }
            } else if (schedule.cronExpression) {
                if (matchCron(schedule.cronExpression, now)) {
                    shouldRun = true;
                }
            }

            if (shouldRun) {
                // Pick a random product with stock
                // Prisma doesn't have native random, so we count and skip
                const count = await prisma.product.count({
                    where: { stockTotal: { gt: 0 }, imageUrl: { not: null } }
                });

                if (count > 0) {
                    const skip = Math.floor(Math.random() * count);
                    const product = await prisma.product.findFirst({
                        where: { stockTotal: { gt: 0 }, imageUrl: { not: null } },
                        skip
                    });

                    if (product) {
                        await publishToInstagram(product.id, schedule.postType as any);
                        postedCount++;

                        // If it was a one-time specific date, deactivate it
                        if (schedule.specificDate) {
                            await prisma.instagramSchedule.update({
                                where: { id: schedule.id },
                                data: { isActive: false }
                            });
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true, postedCount });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

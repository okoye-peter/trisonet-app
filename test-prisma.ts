import { PrismaClient } from './backend/src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.notification.count();
        console.log('Notification count:', count);
        
        const user = await prisma.user.findFirst();
        if (user) {
            console.log('Testing getUserNotifications for user:', user.id.toString());
            const notifications = await prisma.notificationUser.findMany({
                where: { userId: user.id },
                include: { notification: true },
                orderBy: { notification: { createdAt: 'desc' } },
                take: 20,
                skip: 0
            });
            console.log('Notifications found:', notifications.length);
        }
    } catch (error) {
        console.error('Prisma Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

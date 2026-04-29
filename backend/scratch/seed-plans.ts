import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    const plans = [
        { name: 'Bronze', minAmount: 1000000, maxAmount: 9999999 },
        { name: 'Silver', minAmount: 10000000, maxAmount: 49999999 },
        { name: 'Gold', minAmount: 50000000, maxAmount: 99999999 },
        { name: 'Diamond', minAmount: 100000000, maxAmount: 999999999 },
        { name: 'Platinum', minAmount: 1000000000, maxAmount: 10000000000 },
    ];

    console.log('Seeding patron plans with unique names...');

    for (const planData of plans) {
        await prisma.patronPlan.upsert({
            where: { name: planData.name },
            update: planData,
            create: planData,
        });
    }

    console.log('Seed completed!');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

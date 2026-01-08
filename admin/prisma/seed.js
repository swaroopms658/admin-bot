
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const config = await prisma.config.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            systemInstructions: 'You are a helpful assistant.',
            llmProvider: 'gemini',
            modelName: 'gemini-pro',
        },
    });
    console.log({ config });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

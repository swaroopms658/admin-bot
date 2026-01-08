'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getConfig() {
    let config = await prisma.config.findFirst();
    if (!config) {
        config = await prisma.config.create({
            data: {
                systemInstructions: "You are a helpful assistant.",
                llmProvider: "gemini",
                modelName: "gemini-pro"
            }
        });
    }
    return config;
}

export async function updateConfig(formData: FormData) {
    const systemInstructions = formData.get('systemInstructions') as string;
    const llmProvider = formData.get('llmProvider') as string;
    const apiKey = formData.get('apiKey') as string;
    const discordBotToken = formData.get('discordBotToken') as string;
    const modelName = formData.get('modelName') as string;

    // Simple update for the singleton config
    await prisma.config.update({
        where: { id: 1 },
        data: {
            systemInstructions,
            llmProvider,
            apiKey: apiKey || undefined, // Don't clear if empty, or maybe handle explicitly? For now handle overwrite.
            discordBotToken: discordBotToken || undefined,
            modelName
        }
    });

    revalidatePath('/');
}

export async function addAllowedChannel(formData: FormData) {
    const channelId = formData.get('channelId') as string;
    const name = formData.get('name') as string;

    if (channelId) {
        await prisma.allowedChannel.create({
            data: {
                id: channelId,
                name
            }
        });
        revalidatePath('/');
    }
}

export async function removeAllowedChannel(id: string) {
    await prisma.allowedChannel.delete({
        where: { id }
    });
    revalidatePath('/');
}

export async function getAllowedChannels() {
    return await prisma.allowedChannel.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function getLogs() {
    return await prisma.conversationLog.findMany({
        take: 50,
        orderBy: { timestamp: 'desc' }
    });
}

export async function resetLogs() {
    await prisma.conversationLog.deleteMany();
    revalidatePath('/');
}

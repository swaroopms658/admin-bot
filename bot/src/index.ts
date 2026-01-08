
import { Client, GatewayIntentBits, Message } from 'discord.js';
import dotenv from 'dotenv';
import { getConfig, isChannelAllowed, addLog, getHistory } from './db.js';
import { generateResponse } from './llm.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user?.tag}`);
    console.log(`Currently in ${client.guilds.cache.size} servers.`);
    client.guilds.cache.forEach(g => console.log(` - ${g.name} (${g.id})`));
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;

    // Check Allow-list
    console.log(`Received message in channel: ${message.channelId}`);
    const allowed = await isChannelAllowed(message.channelId);
    console.log(`Channel ${message.channelId} allowed? ${allowed}`);

    if (!allowed) {
        // Optional: Log ignored message? No, keep it clean.
        return;
    }

    try {
        const config = await getConfig();
        if (!config) {
            console.error("No config found in DB.");
            return;
        }

        // Indicate typing
        if ('sendTyping' in message.channel) {
            await message.channel.sendTyping();
        }

        // Log User Message
        await addLog(message.channelId, message.author.id, message.author.username, 'user', message.content);

        // Get History for Context (e.g. last 10 messages)
        const historyRows = await getHistory(message.channelId);
        // Convert to LLM format
        const history = historyRows.map((row: any) => ({
            role: row.role as 'user' | 'assistant',
            content: row.message
        }));

        // Add current message to history is usually redundant if we just fetched it from DB,
        // BUT we just added it to DB above. So fetching it ensures consistency.
        // Wait, getHistory order? db.ts says "reverse()".
        // Does it include the one we just inserted? Yes.

        const responseText = await generateResponse(history, config);

        // Log Assistant Response
        await addLog(message.channelId, client.user?.id || 'bot', 'Assistant', 'assistant', responseText);

        // Reply (Handling 2000 char limit)
        const MAX_LENGTH = 1900; // Leave buffer
        if (responseText.length > MAX_LENGTH) {
            const chunks = responseText.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'g')) || [];
            for (const chunk of chunks) {
                await message.reply(chunk);
            }
        } else {
            await message.reply(responseText);
        }

    } catch (error) {
        console.error("Error processing message:", error);
        await message.reply("Beep boop. I encountered an error with my brain.");
    }
});

// We need the token. 
// It comes from the DB (Config) OR Environment for the initial login.
// Problem: We can't fetch config until we start. But we can't start without token.
// Solution: Check Environment first, then DB.
// But mostly users will want to configure it via Admin.
// So we try fetching Config first.

// Wrap connection logic in async IIFE
(async () => {
    let config = await getConfig();
    const token = process.env.DISCORD_TOKEN || config?.discordBotToken;

    if (!token) {
        console.error("Error: No Discord Token found in .env or Database Config. Please configure via Admin Console.");
        // We can try polling Config?
        // Build a retry loop
        const interval = setInterval(async () => {
            config = await getConfig();
            if (config?.discordBotToken) {
                clearInterval(interval);
                client.login(config.discordBotToken);
            } else {
                console.log("Waiting for Discord Token configuration...");
            }
        }, 5000);
    } else {
        client.login(token);
    }
})();

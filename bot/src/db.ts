import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export interface Config {
    id: number;
    systemInstructions: string;
    llmProvider: string;
    apiKey?: string;
    discordBotToken?: string;
    modelName: string;
}

export async function getConfig(): Promise<Config | undefined> {
    try {
        const res = await pool.query('SELECT * FROM "Config" WHERE id = 1');
        return res.rows[0] as Config;
    } catch (e) {
        console.error("Error fetching config:", e);
        return undefined;
    }
}

export async function isChannelAllowed(channelId: string): Promise<boolean> {
    try {
        const res = await pool.query('SELECT id FROM "AllowedChannel" WHERE id = $1', [channelId]);
        return res.rows.length > 0;
    } catch (e) {
        console.error("Error checking allowed channel:", e);
        return false;
    }
}

export async function addLog(channelId: string, userId: string, username: string, role: 'user' | 'assistant', message: string) {
    try {
        // timestamp defaults to now() in DB if not provided, or we pass it.
        // Prisma model: timestamp DateTime @default(now())
        // Postgres expects proper timestamp.

        await pool.query(
            `INSERT INTO "ConversationLog" ("channelId", "userId", "username", "message", "role", "timestamp")
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [channelId, userId, username, message, role]
        );
    } catch (e) {
        console.error("Error adding log:", e);
    }
}

export async function getHistory(channelId: string): Promise<any[]> {
    try {
        const res = await pool.query(
            `SELECT * FROM "ConversationLog" WHERE "channelId" = $1 ORDER BY "timestamp" DESC LIMIT 10`,
            [channelId]
        );
        return res.rows.reverse();
    } catch (e) {
        console.error("Error getting history:", e);
        return [];
    }
}

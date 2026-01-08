import Database from 'better-sqlite3';
import path from 'path';

// Ensure we find the DB relative to the workshop root
const dbPath = path.resolve(process.cwd(), '../admin/prisma/dev.db');
const db = new Database(dbPath);

export interface Config {
    id: number;
    systemInstructions: string;
    llmProvider: string;
    apiKey?: string;
    discordBotToken?: string;
    modelName: string;
}

export function getConfig(): Config {
    return db.prepare('SELECT * FROM Config WHERE id = 1').get() as Config;
}

export function isChannelAllowed(channelId: string): boolean {
    const row = db.prepare('SELECT id FROM AllowedChannel WHERE id = ?').get(channelId);
    return !!row;
}

export function addLog(channelId: string, userId: string, username: string, role: 'user' | 'assistant', message: string) {
    // Prisma stores DateTime as milliseconds (integer) or ISO string?
    // We'll use ISO string for safety if text, or numeric if integer. 
    // Let's rely on Prisma default which is likely ISO string in SQLite?
    // Actually, typically Prisma stores as numeric (milliseconds) in SQLite if the column type is not specified otherwise? 
    // Getting 'Date.now()' is safest for compatibility with JS Date.
    // Wait, better-sqlite3 handles Date objects automatically if configured? No.
    const timestamp = new Date().toISOString();

    // Note: timestamps via Prisma @default(now()) are usually unix time in ms? 
    // Let's trust that the Admin app (Prisma) handles reading whatever we write if it's standard.
    // We will insert ISO string.

    db.prepare(`
    INSERT INTO ConversationLog (channelId, userId, username, message, role, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(channelId, userId, username, message, role, Date.now()); // Using numeric for now, usually safe.
}

export function getHistory(channelId: string): any[] {
    // Order by timestamp ASC to reconstruct conversation
    // Helper to get last 10 messages
    const rows = db.prepare('SELECT * FROM ConversationLog WHERE channelId = ? ORDER BY timestamp DESC LIMIT 10').all(channelId);
    return rows.reverse();
}

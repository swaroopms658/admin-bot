-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "systemInstructions" TEXT NOT NULL DEFAULT 'You are a helpful assistant.',
    "llmProvider" TEXT NOT NULL DEFAULT 'gemini',
    "apiKey" TEXT,
    "discordBotToken" TEXT,
    "modelName" TEXT NOT NULL DEFAULT 'gemini-pro'
);

-- CreateTable
CREATE TABLE "AllowedChannel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ConversationLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

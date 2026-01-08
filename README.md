# 🧠 Neural Admin Bot

A powerful Discord Bot integrated with a state-of-the-art "Neural" Admin Dashboard. This system allows you to manage your AI agent's behavior, personality, and access control in real-time through a premium web interface.

![Neural Admin Dashboard](https://github.com/swaroopms658/admin-bot/assets/placeholder-image.png)

## 🌟 Features

*   **Neural Admin Dashboard**: A Next.js 15 application with a high-fidelity "Glassmorphism" UI.
    *   **Real-time Configuration**: Change your bot's LLM provider (Gemini/OpenAI), model, and system prompt on the fly.
    *   **Live Neural Feed**: Watch the bot's conversations stream in real-time.
    *   **Secure Access Control**: Whitelist Discord channels directly from the UI.
    *   **Encrypted Credential Storage**: Safely store API keys in a Postgres database.
*   **Intelligent Discord Bot**:
    *   Built with Discord.js v14.
    *   Supports Google Gemini and OpenAI models.
    *   Context-aware conversations with persistent memory.

## 🏗️ Architecture

The project is a monorepo containing two main components:

1.  **`admin/`**: Next.js (App Router), Tailwind CSS v4, Prisma ORM.
2.  **`bot/`**: Node.js, Discord.js, `pg` (Postgres driver).

Both components share a single **Vercel Postgres (Neon)** database.

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+
*   A Vercel Account
*   A Discord Bot Token ([Get one here](https://discord.com/developers/applications))
*   Google Gemini or OpenAI API Key

### 1. Database Setup (Vercel)

This project relies on Vercel Postgres.

1.  Create a new project on Vercel and import the `admin` folder.
2.  In the Vercel Dashboard, go to **Storage** and create a **Postgres** database.
3.  Go to **Settings > Environment Variables** and ensure the database credentials (`POSTGRES_PRISMA_URL`, etc.) are linked.

### 2. Local Development

Clone the repository:

```bash
git clone https://github.com/swaroopms658/admin-bot.git
cd admin-bot
```

#### Setup Admin Console

1.  Navigate to the admin folder:
    ```bash
    cd admin
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Pull env vars from Vercel (requires Vercel CLI):
    ```bash
    npx vercel env pull .env.development.local
    ```
4.  Generate Prisma Client:
    ```bash
    npx prisma generate
    ```
5.  Run the development server:
    ```bash
    npm run dev
    ```
   Open [http://localhost:3000](http://localhost:3000).

#### Setup Discord Bot

1.  Navigate to the bot folder:
    ```bash
    cd ../bot
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file with your database URL (copy `POSTGRES_URL_NON_POOLING` from admin's `.env`):
    ```env
    POSTGRES_URL=postgres://...
    ```
    *(Note: Bot Tokens and API Keys are now managed via the Admin UI, so you don't need them in the local .env)*
4.  Start the bot:
    ```bash
    npm run dev
    ```

## 📦 Deployment

### Admin Interface
Deploy the `admin` directory to Vercel.
*   **Build Command**: `next build`
*   **Install Command**: `npm install`
*   **Output Directory**: `.next`

**Important**: Add a "postinstall" script to `package.json` to generate the Prisma client during build:
```json
"postinstall": "prisma generate"
```
*(This is already included in the repo)*

### Discord Bot
The bot needs a persistent runtime (it cannot be deployed to Vercel Serverless Functions).
Recommended hosting:
*   **VPS** (DigitalOcean, Hetzner, AWS EC2) - Use PM2 to keep it running.
*   **Railway / Heroku** (Worker dyno).
*   **Local Host** (for testing).

## 🛠️ Usage

1.  **Authorize Channels**: The bot will ignore all messages by default. Go to the Admin Dashboard > **Access Control** and add the Channel ID of the channel you want the bot to speak in.
2.  **Configure Brain**: Go to **Neural Core** in the Dashboard to set the System Prompt (e.g., "You are a pirate").
3.  **Chat**: Send a message in the authorized Discord channel!

## 📄 License

MIT

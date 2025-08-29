import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Define types for config
interface EmbedColors {
    Success: number;
    Error: number;
    Warning: number;
    Info: number;
    Primary: number;
}

interface RedisConfig {
    HOST: string | undefined;
    PORT: number;
    PASSWORD: string;
}

interface BotConfig {
    BOT_PREFIX: string;
    DISCORD_TOKEN: string;
    BOT_NAME: string;
    DEFAULT_ACTIVITY: string;
    BOT_ID: string;
    YOUTUBE_COOKIE: string;
    EMBED_COLOR: EmbedColors;
    REDIS: RedisConfig;
}

// Create config object with proper typing
const config: BotConfig = {
    BOT_PREFIX: process.env.DISCORD_PREFIX || '!',
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
    BOT_NAME: process.env.BOT_NAME || 'KuuhakuBot',
    DEFAULT_ACTIVITY: process.env.DEFAULT_ACTIVITY || 'Music',
    BOT_ID: '',
    YOUTUBE_COOKIE: process.env.YOUTUBE_COOKIE || '',
    EMBED_COLOR: {
        Success: 0x00fa9a,
        Error: 0xff2a16,
        Warning: 0xffd700,
        Info: 0x00bfaf,
        Primary: 0x3498db,
    },
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: Number(process.env.REDIS_PORT) || 6379,
        PASSWORD: process.env.REDIS_PASSWORD || '',
    },
};

/**
 * Sets the bot ID after the client is ready
 * @param botId The bot's Discord ID
 */
export function setBotId(botId: string): void {
    config.BOT_ID = botId;
}

export default config;
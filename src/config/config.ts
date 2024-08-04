import dotenv from 'dotenv'

dotenv.config({ path: '.env' }).parsed

const config = {
    BOT_PREFIX: process.env.DISCORD_PREFIX || '',
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
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
        PORT: Number(process.env.REDIS_PORT),
        PASSWORD: process.env.REDIS_PASSWORD || '',
    },
}

export default config

export function setBotId(botId: string) {
config.BOT_ID = botId;
}
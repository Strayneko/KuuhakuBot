import dotenv from 'dotenv'

dotenv.config()

const config = {
    BOT_PREFIX: process.env.DISCORD_PREFIX || '',
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
    BOT_ID: '',
}

export default config

export function setBotId(botId: string) {
config.BOT_ID = botId;
}
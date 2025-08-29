import { initializeBot } from '@/bot/client';
import config from '@/config/config';

(async () => {
    try {
        const client = await initializeBot();
        // Login with the token from .env
        await client.login(config.DISCORD_TOKEN);
    } catch (error) {
        console.error('Failed to initialize bot:', error);
        process.exit(1);
    }
})()
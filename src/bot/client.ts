import 'module-alias/register';
import { ActivityType, Client, Events, IntentsBitField } from 'discord.js';
import config from '@/config/config';
import { handleCommand } from '@/handlers/message_handler';
import initPlayer from '@/handlers/player_handler';

// Create a new Client instance
const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});

export async function initializeBot(): Promise<Client> {
    await initPlayer(client);

    // Listen for the client to be ready
    client.once(Events.ClientReady, (c) => {
        console.log(`Bot is now running. Press CTRL-C to exit. Logged in as ${c.user.tag}`);
        client.user?.setActivity({
            name: config.DEFAULT_ACTIVITY,
            type: ActivityType.Custom,
        });
    });

    client.on(Events.MessageCreate, handleCommand);
    
    return client;
}
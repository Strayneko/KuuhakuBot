import 'module-alias/register';
import {Client, EmbedBuilder, Events, IntentsBitField} from 'discord.js';
import config, { setBotId } from '@/config/config';
import messageHandler from '@/handlers/message_handler';
import initPlayer from '@/handlers/player_handler';

// create a new Client instance
const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildMembers, 
        IntentsBitField.Flags.GuildMessages, 
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});

(async () => {
    await initPlayer(client);
    
    // listen for the client to be ready
    client.once(Events.ClientReady, (c) => {
       setBotId(c.user.id)
       console.log(`Bot is now running. Press CTRL-C to exit. Logged in as ${c.user.tag}`);
    });

    client.on(Events.MessageCreate, messageHandler)
    // login with the token from .env.local
    client.login(config.DISCORD_TOKEN);
})()
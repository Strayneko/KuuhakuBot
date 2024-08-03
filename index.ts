// import discord.js
import {Client, Events, GatewayIntentBits, IntentsBitField} from 'discord.js';
import config, { setBotId } from './config/config';
import messageHandler from './handlers/message_handler';

// create a new Client instance
const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildMembers, 
        IntentsBitField.Flags.GuildMessages, 
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.MessageContent,
    ],
});

// listen for the client to be ready

client.once(Events.ClientReady, (c) => {
   setBotId(c.user.id)
   console.log(`Bot is now running. Press CTRL-C to exit. Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, messageHandler)
// login with the token from .env.local
client.login(config.DISCORD_TOKEN);
import { Message, TextChannel } from "discord.js";
import lang from "@/config/lang";
import { validateVoiceChannel, createQueueAndConnect } from "@/services/voice_service";

/**
 * Handler for the join command
 * Invites the bot to the user's voice channel
 * @param msg The Discord message object
 * @param cmdArg Command arguments (not used for join)
 */
export default async function joinVoiceChannelHandler(msg: Message, cmdArg: string): Promise<void> {
    // Validate that user is in a voice channel
    if (!validateVoiceChannel(msg)) {
        return;
    }

    try {
        await createQueueAndConnect(msg);
        if (msg.channel instanceof TextChannel) {
            await msg.channel.send(lang.EN.VOICE.JOINED);
        }
    } catch (error) {
        console.error('Error joining voice channel:', error);
        if (msg.channel instanceof TextChannel) {
            await msg.channel.send('Failed to join voice channel');
        }
    }
}
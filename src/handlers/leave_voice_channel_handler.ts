import { Message, TextChannel } from "discord.js";
import lang from "@/config/lang";
import { leaveVoiceChannel } from "@/services/voice_service";

/**
 * Handler for the leave command
 * Removes the bot from the voice channel
 * @param msg The Discord message object
 * @param cmdArg Command arguments (not used for leave)
 */
export default async function leaveVoiceChannelHandler(msg: Message, cmdArg: string): Promise<void> {
    try {
        await leaveVoiceChannel(msg);
        if (msg.channel instanceof TextChannel) {
            await msg.channel.send(lang.EN.VOICE.LEFT);
        }
    } catch (error) {
        console.error('Error leaving voice channel:', error);
        // Error message is sent by the service function
    }
}
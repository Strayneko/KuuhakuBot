import lang from "@/config/lang";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { useMainPlayer } from "discord-player";
import { Guild, Message } from "discord.js";

export default async function leaveVoiceChannelHandler(msg: Message, cmdArg: string) {
    const queue = useMainPlayer().queues.get(msg.guild as Guild);
    if (!queue) return;

    const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
    if (!inSameVoiceChannel) return;

    if (!queue.deleted) {
        queue.delete();
    }
    
    msg.channel.send(lang.EN.VOICE.LEFT);
}
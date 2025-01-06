import lang from "@/config/lang";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import resetActivity from "@/utils/reset_activity";
import { useMainPlayer } from "discord-player";
import { Guild, Message, TextChannel } from "discord.js";

export default async function leaveVoiceChannelHandler(msg: Message, cmdArg: string) {
    const queue = useMainPlayer().queues.get(msg.guild as Guild);
    if (!queue) return;

    const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
    if (!inSameVoiceChannel) return;

    if (!queue.deleted) {
        queue.delete();
        resetActivity(msg.client);
    }
    

    (msg.channel as TextChannel).send(lang.EN.VOICE.LEFT);
}
import lang from "@/config/lang";
import { useMainPlayer } from "discord-player";
import { Guild, Message } from "discord.js";

export default async function leaveVoiceChannelHandler(msg: Message, cmdArg: string) {
    useMainPlayer().queues.get(msg.guild as Guild)?.delete();
    msg.channel.send(lang.EN.VOICE.LEFT);
}
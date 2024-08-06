import lang from "@/config/lang";
import { useMainPlayer } from "discord-player";
import { Guild, Message } from "discord.js";

export default async function joinVoiceChannelHandler(msg: Message, cmdArg: string) {
    if (!msg.member?.voice.channel) {
        msg.channel.send(lang.EN.VOICE.NOT_CONNECTED);
        return;
    }

    const player = useMainPlayer();
    const queue = player.queues.create(msg.guild as Guild, {
        leaveOnEmpty: false,
        leaveOnEnd: false,
    });

    if (queue.connection) return;
    queue.connect(msg.member.voice.channel);
    msg.channel.send(lang.EN.VOICE.JOINED);
}
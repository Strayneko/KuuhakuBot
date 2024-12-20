import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import { GuildQueue } from "discord-player";
import { Message, TextChannel } from "discord.js";

export default function checkSameVoiceChannel(msg: Message, queue: GuildQueue): boolean {
    if (!queue) return false;

    if (msg.member?.voice.channel?.id !== queue.dispatcher?.channel.id) {
        (msg.channel as TextChannel).send(lang.EN.QUEUE.NOT_IN_SAME_CHANNEL);
        return false;
    }
    return true;
}
import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { Message, TextChannel } from "discord.js";

export default async function queueShuffleHandler(msg: Message, cmdArg: string): Promise<void> {
    const queue = useQueue(msg);
    if (!queue) return;

    const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
    if (!inSameVoiceChannel) return;

    queue.tracks.shuffle();
    (msg.channel as TextChannel).send(lang.EN.QUEUE.SHUFFLED);
}
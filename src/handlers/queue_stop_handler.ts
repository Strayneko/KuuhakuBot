import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { Message } from "discord.js";

export default function queueStopHandler(msg: Message, cmdArg: string) {
    const queue = useQueue(msg);
    if (!queue) return;

    const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
    if (!inSameVoiceChannel) return;

    queue.delete();
    msg.channel.send(lang.EN.QUEUE.STOP);
}
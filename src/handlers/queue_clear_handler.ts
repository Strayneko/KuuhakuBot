import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { Message } from "discord.js";

export default async function queueClearHandler(msg: Message, cmdArg: string) {
    const queue = useQueue(msg);
    if (!queue) return;

    if (!checkSameVoiceChannel(msg, queue)) return;

    queue.node.stop();
    queue.tracks.clear();
    msg.channel.send(lang.EN.QUEUE.EMPTY);
}
import useQueue from "@/hooks/use_queue_hook";
import { Message } from "discord.js";

export default async function queueShuffleHandler(msg: Message, cmdArg: string): Promise<void> {
    const queue = useQueue(msg);
    if (!queue) return;

    queue.tracks.shuffle();
    msg.channel.send('Shuffled');
}
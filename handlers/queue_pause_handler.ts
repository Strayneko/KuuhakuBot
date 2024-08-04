import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import { Message } from "discord.js";

export default function queuePauseHandler(msg: Message, cmdArg: string) {
    const queue = useQueue(msg);
    if (!queue) return;
    
    queue.node.pause();
    msg.channel.send(lang.EN.QUEUE.PAUSED);
}
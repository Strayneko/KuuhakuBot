import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { QueueRepeatMode } from "discord-player";
import { Message } from "discord.js";

export default function queueLoopHandler(msg: Message, cmdArg: string) {
    const queue = useQueue(msg);
    if (!queue) return;

    const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
    if (!inSameVoiceChannel) return;

    if (cmdArg.length === 0) {
        msg.channel.send(lang.EN.QUEUE.MISSING_REPEAT_ARG);
        return;
    }

    const currentRepeatMode = queue!.repeatMode;
    const repeatMode = cmdArg.toUpperCase() === 'ON' ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF;
    if (currentRepeatMode === repeatMode) {
        const repeateModeStatus = currentRepeatMode === QueueRepeatMode.QUEUE ? 'ON': 'OFF';
        msg.channel.send(`${lang.EN.QUEUE.SAME_REPEAT_ARG}${repeateModeStatus}`);
        return;
    }

    queue.setRepeatMode(repeatMode)
    if (cmdArg.toUpperCase() === 'ON') {
        msg.channel.send(lang.EN.QUEUE.REPEAT_MODE_ON);
        return;
    }
    
    msg.channel.send(lang.EN.QUEUE.REPEAT_MODE_OFF);
} 
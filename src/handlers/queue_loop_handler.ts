import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { QueueRepeatMode } from "discord-player";
import { Message, TextChannel } from "discord.js";

/**
 * Handler for the loop command
 * Toggles queue looping
 * @param msg The Discord message object
 * @param cmdArg The command arguments (ON/OFF)
 */
export default function queueLoopHandler(msg: Message, cmdArg: string): void {
  const queue = useQueue(msg);
  if (!queue) return;

  const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
  if (!inSameVoiceChannel) return;

  if (cmdArg.length === 0) {
    if (msg.channel instanceof TextChannel) {
      msg.channel.send(lang.EN.QUEUE.MISSING_REPEAT_ARG);
    }
    return;
  }

  const currentRepeatMode = queue!.repeatMode;
  const repeatMode = cmdArg.toUpperCase() === 'ON' ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF;
  
  if (currentRepeatMode === repeatMode) {
    const repeateModeStatus = currentRepeatMode === QueueRepeatMode.QUEUE ? 'ON' : 'OFF';
    if (msg.channel instanceof TextChannel) {
      msg.channel.send(`${lang.EN.QUEUE.SAME_REPEAT_ARG}${repeateModeStatus}`);
    }
    return;
  }

  queue.setRepeatMode(repeatMode);
  
  if (cmdArg.toUpperCase() === 'ON') {
    if (msg.channel instanceof TextChannel) {
      msg.channel.send(lang.EN.QUEUE.REPEAT_MODE_ON);
    }
    return;
  }
  
  if (msg.channel instanceof TextChannel) {
    msg.channel.send(lang.EN.QUEUE.REPEAT_MODE_OFF);
  }
} 
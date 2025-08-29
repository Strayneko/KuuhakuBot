import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { Message, TextChannel } from "discord.js";

/**
 * Handler for the pause command
 * Pauses the current track
 * @param msg The Discord message object
 * @param cmdArg The command arguments (not used for pause)
 */
export default function queuePauseHandler(msg: Message, cmdArg: string): void {
  const queue = useQueue(msg);
  if (!queue) return;

  const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
  if (!inSameVoiceChannel) return;
  
  queue.node.pause();
  if (msg.channel instanceof TextChannel) {
    msg.channel.send(lang.EN.QUEUE.PAUSED);
  }
}
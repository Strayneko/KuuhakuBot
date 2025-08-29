import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { Message, TextChannel } from "discord.js";

/**
 * Handler for the stop command
 * Stops playback and clears the queue
 * @param msg The Discord message object
 * @param cmdArg The command arguments (not used for stop)
 */
export default function queueStopHandler(msg: Message, cmdArg: string): void {
  const queue = useQueue(msg);
  if (!queue) return;

  const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
  if (!inSameVoiceChannel) return;

  queue.delete();
  if (msg.channel instanceof TextChannel) {
    msg.channel.send(lang.EN.QUEUE.STOP);
  }
}
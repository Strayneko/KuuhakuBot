import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { Message, TextChannel } from "discord.js";

/**
 * Handler for the clear command
 * Clears the queue
 * @param msg The Discord message object
 * @param cmdArg The command arguments (not used for clear)
 */
export default async function queueClearHandler(msg: Message, cmdArg: string): Promise<void> {
  const queue = useQueue(msg);
  if (!queue) return;

  if (!checkSameVoiceChannel(msg, queue)) return;

  queue.node.stop();
  queue.clear();

  if (msg.channel instanceof TextChannel) {
    msg.channel.send(lang.EN.QUEUE.EMPTY);
  }
}
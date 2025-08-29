import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { Message, TextChannel } from "discord.js";

/**
 * Handler for the shuffle command
 * Shuffles the queue
 * @param msg The Discord message object
 * @param cmdArg The command arguments (not used for shuffle)
 */
export default async function queueShuffleHandler(msg: Message, cmdArg: string): Promise<void> {
  const queue = useQueue(msg);
  if (!queue) return;

  const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
  if (!inSameVoiceChannel) return;

  queue.tracks.shuffle();
  if (msg.channel instanceof TextChannel) {
    msg.channel.send(lang.EN.QUEUE.SHUFFLED);
  }
}
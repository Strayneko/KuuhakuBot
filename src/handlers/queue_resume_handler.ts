import lang from "@/config/lang";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { Message, TextChannel } from "discord.js";

/**
 * Handler for the resume command
 * Resumes the paused track
 * @param msg The Discord message object
 * @param cmdArg The command arguments (not used for resume)
 */
export default function queueResumeHandler(msg: Message, cmdArg: string): void {
  const queue = useQueue(msg);
  if (!queue) return;

  const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
  if (!inSameVoiceChannel) return;

  queue.node.resume();
  if (msg.channel instanceof TextChannel) {
    msg.channel.send(lang.EN.QUEUE.RESUMED);
  }
}
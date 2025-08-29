import config from "@/config/config";
import useQueue from "@/hooks/use_queue_hook";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { formatQueueList } from "@/services/queue_service";

/**
 * Handler for the queue command
 * Displays the current queue list
 * @param msg The Discord message object
 * @param cmdArg The command arguments (page number)
 */
export default async function queueListHandler(msg: Message, cmdArg: string): Promise<void> {
  const queue = useQueue(msg);
  if (!queue) return;

  const page = (Number(cmdArg) || 1) - 1;
  const totalPages = Math.ceil(queue.tracks.size / 10) || 1;

  // Validate page number
  if (page >= totalPages && msg.channel instanceof TextChannel) {
    await msg.channel.send(
      `:pleading_face: There are only a total of ${totalPages} pages of songs that ${config.BOT_NAME} can sing.`
    );
    return;
  }

  // Format and send queue list
  const { queueString, currentSong } = formatQueueList(queue, page);
  
  const embed = new EmbedBuilder({
    color: config.EMBED_COLOR.Primary,
    description:
      `**Currently Playing**\n` +
      (currentSong
        ? `\`[${currentSong?.duration}]\` [${currentSong?.title}](${currentSong?.url}) -- Requested by: <@${currentSong.requestedBy?.id}>`
        : "None") +
      `\n\n**Queue**\n${queueString}`,
    thumbnail: { url: currentSong?.thumbnail as string },
    footer: {
      text: `Page ${page + 1} of ${totalPages}`
    }
  });

  if (msg.channel instanceof TextChannel) {
    await msg.channel.send({ embeds: [embed] });
  }
}

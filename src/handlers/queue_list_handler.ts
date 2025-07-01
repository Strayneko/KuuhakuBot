import config from "@/config/config";
import useQueue from "@/hooks/use_queue_hook";
import { EmbedBuilder, Message, TextChannel } from "discord.js";

export default async function queueListHandler(msg: Message, cmdArg: string) {
  const queue = useQueue(msg);
  if (!queue) return;

  const totalPages = Math.ceil(queue.tracks.size / 10) || 1;
  const page = (Number(cmdArg) || 1) - 1;

  if (page >= totalPages) {
    (msg.channel as TextChannel).send(
      `:pleading_face: There are only a total of ${totalPages} pages of songs that ${config.BOT_NAME} can sing.`
    );
    return;
  }


  const queueString = queue.tracks
    .toArray()
    .slice(page * 10, page * 10 + 10)
    .map((song, i) => {
      return `**${page * 10 + i + 1}.** \`[${song.duration}]\` [${song?.title}](${song?.url}) -- <@${song.requestedBy?.id}>`;
    })
    .join("\n");

  const currentSong = queue.currentTrack;
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

  (msg.channel as TextChannel).send({ embeds: [embed] });
}

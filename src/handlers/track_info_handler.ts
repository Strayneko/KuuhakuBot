import config from "@/config/config";
import useQueue from "@/hooks/use_queue_hook";
import { EmbedBuilder, Message, TextChannel } from "discord.js";

export default function trackInfoHandler(msg: Message, cmdArg: string) {
    const queue = useQueue(msg);
    if (!queue) return;

    const bar = queue.node.createProgressBar({
        queue: false,
        length: 19,
    });

    const currentSong = queue.currentTrack;
    const embed = new EmbedBuilder({
        color: config.EMBED_COLOR.Primary,
        thumbnail: {
            url: currentSong?.thumbnail as string,
        },
        description: `Currently Playing [${currentSong?.title}](${currentSong?.url})\n\n ${bar}`,
});
    (msg.channel as TextChannel).send({ embeds: [embed] });
}
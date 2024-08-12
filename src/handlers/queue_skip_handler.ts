import config from "@/config/config";
import useQueue from "@/hooks/use_queue_hook";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import { EmbedBuilder, Message } from "discord.js";

export default async function queueSkipHandler(msg: Message, cmdArg: string) {
    const queue = useQueue(msg);
    if (!queue) return;

    const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
    if (!inSameVoiceChannel) return;

    const currentSong = queue.currentTrack;

    queue.node.skip();
    const embed = new EmbedBuilder({
        description: `${currentSong?.title} has been skipped!`,
        color: config.EMBED_COLOR.Primary,
        thumbnail: {
            url: currentSong?.thumbnail as string,
        }
    });
    msg.channel.send({ embeds: [embed] });
}
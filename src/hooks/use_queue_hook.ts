import lang from "@/config/lang";
import { GuildQueue, useMainPlayer } from "discord-player";
import { Guild, Message, TextChannel } from "discord.js";

export default function useQueue(msg: Message): GuildQueue|null {
    const player = useMainPlayer();
    const queue = player.queues.get(msg.guild as Guild);
    if (!queue || !queue?.isPlaying()) {
      (msg.channel as TextChannel).send(lang.EN.QUEUE.NO_QUEUE);
      return null;
    }

    return queue;
}
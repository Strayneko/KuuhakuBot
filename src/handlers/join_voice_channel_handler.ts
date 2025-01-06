import lang from "@/config/lang";
import getPlayerOptions from "@/utils/get_player_options";
import { GuildNodeCreateOptions, useMainPlayer } from "discord-player";
import { Guild, Message } from "discord.js";
import { TextChannel } from "discord.js";

export default async function joinVoiceChannelHandler(msg: Message, cmdArg: string) {
    if (!msg.member?.voice.channel) {
        (msg.channel as TextChannel).send(lang.EN.VOICE.NOT_CONNECTED);
        return;
    }

    const options = getPlayerOptions(msg) as unknown as GuildNodeCreateOptions;
    const player = useMainPlayer();
    const queue = player.queues.create(msg.guild as Guild, options);

    if (queue.connection) return;
    queue.connect(msg.member.voice.channel);
    (msg.channel as TextChannel).send(lang.EN.VOICE.JOINED);
}
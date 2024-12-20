import lang from "@/config/lang";
import { QueueRepeatMode, useMainPlayer } from "discord-player";
import { Guild, Message } from "discord.js";
import { TextChannel } from "discord.js";

export default async function joinVoiceChannelHandler(msg: Message, cmdArg: string) {
    if (!msg.member?.voice.channel) {
        (msg.channel as TextChannel).send(lang.EN.VOICE.NOT_CONNECTED);
        return;
    }

    const player = useMainPlayer();
    const queue = player.queues.create(msg.guild as Guild, {
        metadata: {
            channel: (msg.channel as TextChannel) as any,
            guild: msg.guild
          },
          repeatMode: QueueRepeatMode[0] as unknown as QueueRepeatMode,
          noEmitInsert: true,
          leaveOnStop: false,
          leaveOnEmpty: false,
          leaveOnEnd: false,
          pauseOnEmpty: false,
          preferBridgedMetadata: true,
          disableBiquad: true,
    });

    if (queue.connection) return;
    queue.connect(msg.member.voice.channel);
    (msg.channel as TextChannel).send(lang.EN.VOICE.JOINED);
}
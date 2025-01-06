import { GuildNodeCreateOptions, PlayerNodeInitializerOptions, QueueRepeatMode } from "discord-player";
import { Message, TextChannel } from "discord.js";

export default function getPlayerOptions<T>(msg: Message): PlayerNodeInitializerOptions<T> | GuildNodeCreateOptions<T> {
    return {
      nodeOptions: {
        metadata: {
          channel: msg.channel as TextChannel,
          guild: msg.guild
        } as T,
        repeatMode: QueueRepeatMode.OFF,
        noEmitInsert: true,
        leaveOnStop: false,
        leaveOnEmpty: false,
        leaveOnEnd: false,
        pauseOnEmpty: false,
        disableBiquad: true,
      },
      requestedBy: msg.author,
      connectionOptions: {
        deaf: true
      },
    };
  }
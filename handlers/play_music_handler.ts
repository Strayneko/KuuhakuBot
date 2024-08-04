import {
  EmbedBuilder,
  Guild,
  User,
  type Message
} from "discord.js";
import lang from "@/config/lang";
import {
  GuildQueue,
  PlayerNodeInitializerOptions,
  QueryType,
  QueueRepeatMode,
  SearchResult,
  Track,
  useMainPlayer,
} from "discord-player";
import config from "@/config/config";
import durationFormatter from "@/utils/duration_formatter"

export default async function playMusicHandler(msg: Message, cmdArg: string) {
  if (!msg.member?.voice.channel) {
    msg.channel.send(lang.EN.VOICE.NOT_CONNECTED);
    return;
  }

  const player = useMainPlayer();
  const results = await player?.search(cmdArg, {
    searchEngine: QueryType.YOUTUBE,
    requestedBy: msg.member,
  });

  if (results.isEmpty()) {
    msg.channel.send(lang.EN.YT_SEARCH.NO_RESULT);
    return;
  }

  const options = getPlayerOptions(msg)
  const { track, searchResult, queue } = await player.play(
    msg.member.voice.channel,
    results,
    options,
  );
  const embed = getAddedTrackEmbed(track, searchResult, msg.author, queue)
  msg.channel.send({embeds: [embed]})
}

function getAddedTrackEmbed(track: Track, searchResult: SearchResult, author: User, queue: GuildQueue): EmbedBuilder {

  const remainingTracks = queue.tracks.toArray().slice(1);
  const currentTrackTimestamp = queue.node.getTimestamp()?.current.value ?? 0;
  let totalDuration = Number(queue.currentTrack?.durationMS) - Number(currentTrackTimestamp);

  queue.tracks.data.forEach(track => {
    totalDuration += track.durationMS;
  });

  if (queue.tracks.size === 0) {
    totalDuration = 0;
  }
  
  return new EmbedBuilder({
    title: `${searchResult.hasPlaylist() ? 'Playlist' : 'Track'} queued!`,
    thumbnail: { url: track.thumbnail },
    color: config.EMBED_COLOR.Primary,
    fields: [
      {
				name:   "Track",
				value:  `[${track.title}](${track.url})`,
				inline: false,
			},
			{
				name:   "Estimated time until played",
				value:  durationFormatter(totalDuration),
				inline: true,
			},
			{
				name:   "Track Length",
				value:  durationFormatter(track.durationMS),
				inline: true,
			},
			{
				name:   "Position in upcoming",
				value:  `${remainingTracks.length}`,
				inline: true,
			},
			{
				name:   "Position in queue",
				value:  `${queue.size}`,
				inline: true,
			},
    ],
      footer: {
        text: `Requested by ${author.username}`,
        icon_url: author.avatarURL() as string,
      }
  })
}

function getPlayerOptions<T>(msg: Message): PlayerNodeInitializerOptions<T> {
  return {
    nodeOptions: {
      metadata: {
        channel: msg.channel as any,
        guild: msg.guild,
      } as T,
      repeatMode: QueueRepeatMode[0] as unknown as QueueRepeatMode,
      noEmitInsert: true,
      leaveOnStop: false,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 60000,
      leaveOnEnd: false,
      leaveOnEndCooldown: 600000,
      pauseOnEmpty: false,
      preferBridgedMetadata: true,
      disableBiquad: true
    },
    requestedBy: msg.author,
    connectionOptions: {
      deaf: true
    }
  }
}
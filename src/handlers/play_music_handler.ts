import { EmbedBuilder, Message, TextChannel, User } from "discord.js";
import lang from "@/config/lang";
import {
  GuildQueue,
  PlayerNodeInitializerOptions,
  QueryType,
  SearchResult,
  Track,
  useMainPlayer,
  useQueue
} from "discord-player";
import config from "@/config/config";
import durationFormatter from "@/utils/duration_formatter";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import getPlayerOptions from "@/utils/get_player_options";


export default async function playMusicHandler(msg: Message, cmdArg: string, type: string) {
  const msgChannel: TextChannel = msg.channel as TextChannel;
  if (!msg.member?.voice.channel) {
    msgChannel.send(lang.EN.VOICE.NOT_CONNECTED);
    return;
  }

  const player = useMainPlayer();
  const currentQueue = useQueue(msg.member.guild.id);
  if (currentQueue) {
    if (!checkSameVoiceChannel(msg, currentQueue)) return;
  }

  if (cmdArg.length === 0) {
    msgChannel.send(lang.EN.YT_SEARCH.NO_ARGUMENT);
    return;
  }
  const results = await player.search(cmdArg, {
    requestedBy: msg.member,
  });
  const searchMsg = await msgChannel.send(lang.EN.YT_SEARCH.SEARCHING);

  if (results.isEmpty()) {
    searchMsg.edit(lang.EN.YT_SEARCH.NO_RESULT);
    return;
  }

  const options = getPlayerOptions(msg) as PlayerNodeInitializerOptions<unknown>;
  let playlist: string = "";
  const { track, searchResult, queue } = await player.play(
    msg.member.voice.channel,
    results,
    options,
  );


  const embed = getAddedTrackEmbed(track, searchResult, msg.author, queue);
  const embeds = [embed];

  // add playlist info if search result has playlist
  if (searchResult.hasPlaylist()) {
    const totalPages = Math.ceil(searchResult.tracks.length / 10) || 1;
    const page = 0;
    playlist = searchResult
      .playlist!.tracks.slice(page * 10, page * 10 + 10)
      .map((song, i) => {
        return `**${i + 1}.** \`[${song.duration}]\` [${song.title}](${song.url
          })`;
      })
      .join("\n");

    embeds.push(
      new EmbedBuilder({
        color: config.EMBED_COLOR.Primary,
        description: playlist,
        title: "Playlist",
        footer: {
          text: `Page ${page} of ${totalPages}`
        }
      })
    );
  }
  searchMsg.delete();
  msgChannel.send({ embeds });

  let buffMsg: Message | null = null;

  if (queue.node.isBuffering()) {
    buffMsg = await msgChannel.send(lang.EN.QUEUE.BUFFERING);
  }

  if (queue.node.isPlaying() && buffMsg !== null) {
    buffMsg.delete();
  }
}

function getAddedTrackEmbed(
  track: Track,
  searchResult: SearchResult,
  author: User,
  queue: GuildQueue
): EmbedBuilder {
  const remainingTracks = queue.tracks.toArray().slice(1);
  const currentTrackTimestamp = queue.node.getTimestamp()?.current.value ?? 0;
  let totalDuration =
    Number(queue.currentTrack?.durationMS) - Number(currentTrackTimestamp);

  remainingTracks.map((track) => {
    totalDuration += track.durationMS;
  });

  if (queue.tracks.size === 0) {
    totalDuration = 0;
  }

  return new EmbedBuilder({
    title:
      `${getPlatformIcon(searchResult.queryType)} ` +
      `${searchResult.hasPlaylist() ? "Playlist" : "Track"} queued!`,
    thumbnail: { url: track.thumbnail },
    color: config.EMBED_COLOR.Primary,
    fields: [
      {
        name: "Track",
        value: `[${track.title}](${track.url})`,
        inline: false,
      },
      {
        name: "Estimated time until played",
        value: durationFormatter(totalDuration),
        inline: true,
      },
      {
        name: "Track Length",
        value: durationFormatter(track.durationMS),
        inline: true,
      },
      {
        name: "Position in upcoming",
        value: `${remainingTracks.length}`,
        inline: true,
      },
      {
        name: "Position in queue",
        value: `${queue.size}`,
        inline: true,
      },
    ],
    footer: {
      text: `Requested by ${author.username}`,
      icon_url: author.avatarURL() as string
    }
  });
}

function getPlatformIcon(queryType: string): string {
  if (
    [
      QueryType.APPLE_MUSIC_ALBUM,
      QueryType.APPLE_MUSIC_PLAYLIST,
      QueryType.APPLE_MUSIC_SEARCH,
      QueryType.APPLE_MUSIC_SONG
    ].includes(queryType as any)
  ) {
    return "Apple Music";
  }

  if ([QueryType.YOUTUBE, QueryType.YOUTUBE_PLAYLIST, QueryType.YOUTUBE_SEARCH, QueryType.YOUTUBE_VIDEO].includes(queryType as any)) {
    return "Youtube";
  }

  if ([QueryType.SPOTIFY_ALBUM, QueryType.SPOTIFY_PLAYLIST, QueryType.SPOTIFY_SEARCH, QueryType.SPOTIFY_SONG].includes(queryType as any)) {
    return "Spotify";
  }

  if ([QueryType.SOUNDCLOUD, QueryType.SOUNDCLOUD_PLAYLIST, QueryType.SOUNDCLOUD_SEARCH, QueryType.SOUNDCLOUD_TRACK].includes(queryType as any)) {
    return "Soundcloud";
  }

  return "Youtube";
}

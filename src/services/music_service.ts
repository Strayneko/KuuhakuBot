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

/**
 * Validates prerequisites for playing music
 * @param msg The Discord message object
 * @param cmdArg The command arguments
 * @returns true if validation passes, false otherwise
 */
export async function validatePlayPrerequisites(msg: Message, cmdArg: string): Promise<boolean> {
  const msgChannel: TextChannel = msg.channel as TextChannel;
  
  // Check if user is in voice channel
  if (!msg.member?.voice.channel) {
    if (msg.channel instanceof TextChannel) {
      await msg.channel.send(lang.EN.VOICE.NOT_CONNECTED);
    }
    return false;
  }

  // Check voice channel consistency
  const currentQueue = useQueue(msg.member.guild.id);
  if (currentQueue && !checkSameVoiceChannel(msg, currentQueue)) {
    return false;
  }

  // Check if arguments provided
  if (cmdArg.length === 0) {
    if (msg.channel instanceof TextChannel) {
      await msg.channel.send(lang.EN.YT_SEARCH.NO_ARGUMENT);
    }
    return false;
  }

  return true;
}

/**
 * Searches for music based on the query
 * @param msg The Discord message object
 * @param query The search query
 * @returns Search results or null if no results
 */
export async function searchMusic(msg: Message, query: string): Promise<SearchResult | null> {
  const msgChannel: TextChannel = msg.channel as TextChannel;
  let searchMsg: Message | null = null;
  
  if (msg.channel instanceof TextChannel) {
    searchMsg = await msg.channel.send(lang.EN.YT_SEARCH.SEARCHING);
  }

  const player = useMainPlayer();
  const results = await player.search(query, {
    requestedBy: msg.member as any,
  });

  if (results.isEmpty()) {
    if (searchMsg) {
      await searchMsg.edit(lang.EN.YT_SEARCH.NO_RESULT);
    }
    return null;
  }

  if (searchMsg) {
    await searchMsg.delete();
  }
  return results;
}

/**
 * Plays music using the discord-player
 * @param msg The Discord message object
 * @param results The search results
 * @returns Play result object
 */
export async function playMusic(msg: Message, results: SearchResult) {
  const player = useMainPlayer();
  const options = getPlayerOptions(msg) as PlayerNodeInitializerOptions<unknown>;
  
  return await player.play(
    msg.member!.voice.channel!,
    results,
    options,
  );
}

/**
 * Generates an embed for the added track
 * @param track The track that was added
 * @param searchResult The search result
 * @param author The user who requested the track
 * @param queue The guild queue
 * @returns EmbedBuilder for the track
 */
export function getAddedTrackEmbed(
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

/**
 * Gets the platform icon for a query type
 * @param queryType The query type
 * @returns Platform name
 */
export function getPlatformIcon(queryType: string): string {
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

/**
 * Generates an embed for a playlist
 * @param searchResult The search result containing the playlist
 * @param page The page number to display
 * @returns EmbedBuilder for the playlist
 */
export function getPlaylistEmbed(searchResult: SearchResult, page: number = 0): EmbedBuilder {
  const totalPages = Math.ceil(searchResult.tracks.length / 10) || 1;
  const playlistTracks = searchResult
    .playlist!.tracks.slice(page * 10, page * 10 + 10)
    .map((song, i) => {
      return `**${i + 1}.** \`[${song.duration}]\` [${song.title}](${song.url})`;
    })
    .join("\n");

  return new EmbedBuilder({
    color: config.EMBED_COLOR.Primary,
    description: playlistTracks,
    title: "Playlist",
    footer: {
      text: `Page ${page + 1} of ${totalPages}`
    }
  });
}

/**
 * Handles buffering messages
 * @param msg The Discord message object
 * @param queue The guild queue
 */
export async function handleBuffering(msg: Message, queue: GuildQueue): Promise<void> {
  const msgChannel: TextChannel = msg.channel as TextChannel;
  let buffMsg: Message | null = null;

  if (queue.node.isBuffering() && msg.channel instanceof TextChannel) {
    buffMsg = await msg.channel.send(lang.EN.QUEUE.BUFFERING);
  }

  if (queue.node.isPlaying() && buffMsg !== null) {
    await buffMsg.delete();
  }
}
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import {
  validatePlayPrerequisites,
  searchMusic,
  playMusic,
  getAddedTrackEmbed,
  getPlaylistEmbed,
  handleBuffering
} from "@/services/music_service";

/**
 * Handler for the play command
 * Plays music from various sources
 * @param msg The Discord message object
 * @param cmdArg The command arguments (search query)
 * @param type The music source type (e.g. 'spotify')
 */
export default async function playMusicHandler(msg: Message, cmdArg: string, type: string): Promise<void> {
  // Validate prerequisites
  if (!(await validatePlayPrerequisites(msg, cmdArg))) {
    return;
  }

  // Search for music
  const results = await searchMusic(msg, cmdArg);
  if (!results) {
    return;
  }

  // Play the music
  const { track, searchResult, queue } = await playMusic(msg, results);

  // Create embeds for response
  const embeds: EmbedBuilder[] = [];
  
  // Add track info embed
  const trackEmbed = getAddedTrackEmbed(track, searchResult, msg.author, queue);
  embeds.push(trackEmbed);

  // Add playlist embed if result has playlist
  if (searchResult.hasPlaylist()) {
    const playlistEmbed = getPlaylistEmbed(searchResult);
    embeds.push(playlistEmbed);
  }

  // Send the embeds
  if (msg.channel instanceof TextChannel) {
    await msg.channel.send({ embeds });
  }

  // Handle buffering messages
  if (msg.channel instanceof TextChannel) {
    await handleBuffering(msg, queue);
  }
}

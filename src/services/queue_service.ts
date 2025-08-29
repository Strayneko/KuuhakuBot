import { GuildQueue } from "discord-player";

/**
 * Formats the queue list for display
 * @param queue The guild queue
 * @param page The page number to display
 * @returns Formatted queue string and current song
 */
export function formatQueueList(queue: GuildQueue, page: number): { 
  queueString: string, 
  currentSong: any 
} {
  const queueString = queue.tracks
    .toArray()
    .slice(page * 10, page * 10 + 10)
    .map((song, i) => {
      return `**${page * 10 + i + 1}.** \`[${song.duration}]\` [${song?.title}](${song?.url}) -- <@${song.requestedBy?.id}>`;
    })
    .join("\n");

  const currentSong = queue.currentTrack;
  
  return { queueString, currentSong };
}

/**
 * Skips the current track in the queue
 * @param queue The guild queue
 */
export function skipTrack(queue: GuildQueue): void {
  queue.node.skip();
}
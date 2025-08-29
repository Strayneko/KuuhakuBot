import { Player } from "discord-player";
import { ActivityType, EmbedBuilder, Client } from "discord.js";
import config from "@/config/config";
import chalk from "chalk";
import resetActivity from "@/utils/reset_activity";

/**
 * Sets up all player event handlers
 * @param player The Player instance
 * @param client The Discord client instance
 */
export function setupPlayerEvents(player: Player, client: Client): void {
    // Debug events
    player.on('debug', (msg) => console.debug(chalk.blue(msg)));

    // Player events
    player.events.on('playerStart', (queue, track) => {
        handlePlayerStart(queue, track, client);
    });

    player.events.on('playerError', (queue, error) => {
        console.error('Player error:', error);
    });

    player.events.on('error', (error) => {
        console.error('Player event error:', error);
    });

    player.on('error', (error) => {
        console.error(chalk.red('Player error:', error));
    });

    player.events.on('playerFinish', () => {
        resetActivity(client);
    });
}

/**
 * Handles the playerStart event
 * @param queue The guild queue
 * @param track The track that started playing
 * @param client The Discord client instance
 */
function handlePlayerStart(queue: any, track: any, client: Client): void {
    const embed = new EmbedBuilder({
        color: config.EMBED_COLOR.Primary,
        thumbnail: { url: track.thumbnail },
        fields: [
            {
                name: "Playing track",
                value: `[${track.title}](${track.url}) - **${track.duration}**`,
                inline: true,
            },
        ],
    });
    
    client.user?.setActivity({
        name: track.title,
        type: ActivityType.Listening,
    });

    setTimeout(() => {
        queue.metadata?.channel?.send({ embeds: [embed] });
    }, 500);
}
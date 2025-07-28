import { Player } from "discord-player";
import { ActivityType, EmbedBuilder, type Client } from "discord.js";
import { YoutubeiExtractor } from "discord-player-youtubei"
import { RedisQueryCache } from "@/class/QueryCache";
import { Redis } from "ioredis";
import config from "@/config/config";
import chalk from "chalk";
import { SpotifyExtractor, DefaultExtractors } from "@discord-player/extractor";
import resetActivity from "@/utils/reset_activity";

export default async function initPlayer(client: Client): Promise<Player> {
    const redis = await initRedis()
    const player = new Player(client, {
        skipFFmpeg: false,
        queryCache: new RedisQueryCache(redis),

    });

    getPlayerHandlers(player, client)
    player.extractors.register(YoutubeiExtractor, {
        authentication: config.YOUTUBE_COOKIE,
        generateWithPoToken: true,
        streamOptions: {
            useClient: "WEB_EMBEDDED",
        },
    });
    player.extractors.register(SpotifyExtractor, {});
    player.extractors.loadMulti(DefaultExtractors)
    return player;
}

async function initRedis(): Promise<Redis> {
    const redis = new Redis({
        lazyConnect: true,
        port: config.REDIS.PORT,
        host: config.REDIS.HOST,
        password: config.REDIS.PASSWORD,
    });

    await redis.connect();

    console.log('Connected to Redis');

    return redis;
}

function getPlayerHandlers(player: Player, client: Client) {
    player.on('debug', (msg) => console.debug(chalk.blue(msg)));

    player.events.on('playerStart', (queue, track) => {
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
        }, 500)
    });

    player.events.on('playerError', (queue, error, track) => {
        console.error(error);
    });

    player.events.on('error', (error) => {
        console.error(error)
    });
    player.on('error', (error) => { console.error(chalk.red(error)) });

    player.events.on('playerFinish', (queue, track) => {
        resetActivity(client);
    });
    player.on('error', console.error);

}
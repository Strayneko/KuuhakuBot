import { Player } from "discord-player";
import { ActivityType, EmbedBuilder, type Client } from "discord.js";
import { YoutubeiExtractor } from "discord-player-youtubei"
import { RedisQueryCache } from "@/class/QueryCache";
import { Redis } from "ioredis";
import config from "@/config/config";
import chalk from "chalk";
import { SpotifyExtractor, DefaultExtractors } from "@discord-player/extractor";
import resetActivity from "@/utils/reset_activity";
import { setupPlayerEvents } from "@/services/player_service";

/**
 * Initializes the music player with all required extractors and event handlers
 * @param client The Discord client instance
 * @returns The initialized Player instance
 */
export default async function initPlayer(client: Client): Promise<Player> {
    const redis = await initRedis();
    const player = new Player(client, {
        skipFFmpeg: false,
        queryCache: new RedisQueryCache(redis),
    });

    setupPlayerEvents(player, client);

    // Register extractors
    player.extractors.register(YoutubeiExtractor, {
        authentication: config.YOUTUBE_COOKIE,
        generateWithPoToken: true,
        streamOptions: {
            useClient: "WEB_EMBEDDED",
        },
    });

    player.extractors.register(SpotifyExtractor, {});

    return player;
}

/**
 * Initializes the Redis connection for caching
 * @returns The connected Redis instance
 */
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
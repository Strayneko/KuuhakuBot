import { Player } from "discord-player";
import { EmbedBuilder, type Client } from "discord.js";
import { YoutubeiExtractor } from "discord-player-youtubei"
import { RedisQueryCache } from "@/class/QueryCache";
import { Redis } from "ioredis";
import config from "@/config/config";

export default async function initPlayer(client: Client): Promise<Player> {
    const redis = await initRedis()
    const player = new Player(client, {
        skipFFmpeg: false,
        queryCache: new RedisQueryCache(redis),
        ytdlOptions: {
            requestOptions: {
                headers: {
                    cookie: config.YOUTUBE_COOKIE,
                },
            },
        },
    });

    player.extractors.register(YoutubeiExtractor, {})
    getPlayerHandlers(player)
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

function getPlayerHandlers(player: Player) {
    player.on('debug', console.log);
    
    player.events.on('playerStart', (queue, track) => {
        const embed = new EmbedBuilder({
            color: config.EMBED_COLOR.Primary,
            thumbnail: { url: track.thumbnail },
            fields: [
                {
                    name:   "Playing track",
                    value:  `[${track.title}](${track.url}) - **${track.duration}**`,
                    inline: true,
                },
            ],
        });

        setTimeout(() => {
            queue.metadata?.channel?.send({embeds: [embed]});
        }, 500)
    })
    
    player.events.on('playerError', (queue, error, track) => {
        console.error(error)
    })

    player.events.on('error', (error) => {
        console.error(error)
    })
}
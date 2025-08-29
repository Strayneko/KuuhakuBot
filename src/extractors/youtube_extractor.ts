// Base extractor
import { BaseExtractor, ExtractorInfo, ExtractorSearchContext, Playlist, QueryType, SearchQueryType, Track, Util } from 'discord-player';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Client as YTClient } from 'youtubei';
import type {
    PlaylistVideo,
    CompactVideo,
    Video,
} from "youtubei.js/dist/src/parser/nodes";
import {
    type DownloadOptions,
    InnerTubeConfig,
    InnerTubeClient,
} from "youtubei.js/dist/src/types";
import Innertube, { UniversalCache, YTNodes } from "youtubei.js";
import config from '@/config/config';

export interface AsyncTrackingContext {
    useClient: YTClient;
    highWaterMark?: number;
}

const validPathDomains =
    /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
const validQueryDomains = new Set([
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "gaming.youtube.com",
]);
const idRegex = /^[a-zA-Z0-9-_]{11}$/;

// since it extends BaseExtractor, it is aware of Player who loaded this extractor and thus can access information such as queue, voice connections and more. Those data exist inside context property of BaseExtractor, which is an instance of ExtractorExecutionContext and can be accessed using `this.context`.
export default class YoutubeExtractor extends BaseExtractor {
    public priority = 2;
    static ytContext = new AsyncLocalStorage<AsyncTrackingContext>();
    private interval?: NodeJS.Timeout;
    public innerTube!: Innertube;
    // (required) you should give a unique id for you extractor here.
    static identifier = 'my-youtube-extractor' as const;

    public createBridgeQuery = (track: Track) =>
        `${track.title} by ${track.author} official audio`;

    // this method is called when your extractor is loaded into discord-player's registry
    async activate(): Promise<void> {
        // do something here, such as initializing APIs or whatever

        // you can access initialization options using
        const initOptions = this.options;

        // in order to access Player instance, use
        const player = this.context.player;

        // to register protocol, use
        this.protocols = ['protocol_name'];
        this.innerTube = await Innertube.create({
            cookie: config.YOUTUBE_COOKIE
        });
    }

    static getStreamingContext() {
        const ctx = YoutubeExtractor.ytContext.getStore();
        if (!ctx) throw new Error("INVALID INVOKCATION");
        return ctx;
    }
    // discord-player calls this method when your extractor is removed from its registry
    async deactivate(): Promise<void> {
        // do something here, such as disconnecting from API or cleanup or whatever it is
        // remove protocol for example
        this.protocols = [];
    }

    // discord-player calls this method when it wants some metadata from you. When you return true, discord-player will use you for further processing. If you return false here, discord-player will query another extractor from its registry.
    async validate(query: string, queryType: SearchQueryType): Promise<boolean> {
        if (typeof query !== "string") return false;
        // prettier-ignore
        return ([
            QueryType.YOUTUBE,
            QueryType.YOUTUBE_PLAYLIST,
            QueryType.YOUTUBE_SEARCH,
            QueryType.YOUTUBE_VIDEO,
            QueryType.AUTO,
            QueryType.AUTO_SEARCH
        ] as SearchQueryType[]).some((r) => r === queryType);
    }

    // discord-player calls this method when it wants a search result. It is called with the search query and a context parameter (options passed to player.search() method)
    async handle(query: string, context: ExtractorSearchContext): Promise<ExtractorInfo> {
        const search = await this.innerTube.search(query);
        const videos = search.videos.filter(
            (v) => v.type === "Video",
        ) as Video[];

        return {
            playlist: null,
            tracks: videos.map((v) => this.buildTrack(v, context)),
        };

        // if query contained protocol, you can access that protocol via context.protocol
        // const search = await this.innerTube.search(query);
        // console.log(search)
        return this.createResponse(null, []);
    }

    // discord-player calls this method when it wants you to stream a track. You can either return raw url pointing at a stream or node.js readable stream object. Note: this method wont be called if onBeforeCreateStream was used. It is called with discord-player track object.
    async stream(track: Track): Promise<any> {
        console.log("streaming")
        return;
    }

    // discord-player calls this method when it wants some tracks for autoplay mode.
    async getRelatedTracks(track: Track): Promise<ExtractorInfo> {
        const tracks: Track[] = []; // fetch related tracks logic here
        return this.createResponse(null, []);
    }

    buildTrack(vid: Video, context: ExtractorSearchContext, pl?: Playlist) {
        const duration = Util.buildTimeCode(
            Util.parseMS(vid.duration.seconds * 1000),
        );

        const raw = {
            duration_ms: vid.duration.seconds * 1000,
            live: vid.is_live,
        };

        const track = new Track(this.context.player, {
            title: vid.title.text ?? "UNKNOWN YOUTUBE VIDEO",
            thumbnail: vid.best_thumbnail?.url ?? vid.thumbnails[0]?.url ?? "",
            description: vid.description ?? vid.title ?? "UNKNOWN DESCRIPTION",
            author: vid.author?.name ?? "UNKNOWN AUTHOR",
            requestedBy: context.requestedBy,
            url: `https://youtube.com/watch?v=${vid.id}`,
            views: parseInt((vid.view_count?.text ?? "0").replace(/,/g, "")),
            duration,
            raw,
            playlist: pl,
            source: "youtube",
            queryType: "youtubeVideo",
            async requestMetadata() {
                return this.raw;
            },
            metadata: raw,
            live: vid.is_live,
        });

        track.extractor = this;

        return track;
    }
}
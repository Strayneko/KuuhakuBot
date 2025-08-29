import { Message, TextChannel } from "discord.js";
import lang from "@/config/lang";
import getPlayerOptions from "@/utils/get_player_options";
import { GuildNodeCreateOptions, useMainPlayer } from "discord-player";
import { Guild } from "discord.js";
import checkSameVoiceChannel from "@/utils/check_same_voice_channel";
import resetActivity from "@/utils/reset_activity";

/**
 * Validates that a user is in a voice channel
 * @param msg The Discord message object
 * @returns true if user is in a voice channel, false otherwise
 */
export function validateVoiceChannel(msg: Message): boolean {
    if (!msg.member?.voice.channel) {
        if (msg.channel instanceof TextChannel) {
            msg.channel.send(lang.EN.VOICE.NOT_CONNECTED);
        }
        return false;
    }
    return true;
}

/**
 * Joins the bot to a voice channel
 * @param msg The Discord message object
 */
export async function joinVoiceChannel(msg: Message): Promise<void> {
    if (!msg.member?.voice.channel) {
        throw new Error('User not in voice channel');
    }
    
    const options = getPlayerOptions(msg) as unknown as GuildNodeCreateOptions;
    const player = useMainPlayer();
    const queue = player.queues.create(msg.guild as Guild, options);

    if (queue.connection) return;
    queue.connect(msg.member.voice.channel);
}

/**
 * Creates a queue and connects to a voice channel
 * @param msg The Discord message object
 */
export async function createQueueAndConnect(msg: Message): Promise<void> {
    if (!msg.member?.voice.channel) {
        throw new Error('User not in voice channel');
    }
    
    const options = getPlayerOptions(msg) as unknown as GuildNodeCreateOptions;
    const player = useMainPlayer();
    const queue = player.queues.create(msg.guild as Guild, options);

    if (queue.connection) return;
    queue.connect(msg.member.voice.channel);
}

/**
 * Leaves the voice channel and cleans up
 * @param msg The Discord message object
 */
export async function leaveVoiceChannel(msg: Message): Promise<void> {
    const queue = useMainPlayer().queues.get(msg.guild as Guild);
    if (!queue) {
        if (msg.channel instanceof TextChannel) {
            await msg.channel.send(lang.EN.QUEUE.NO_QUEUE);
        }
        return;
    }

    const inSameVoiceChannel = checkSameVoiceChannel(msg, queue);
    if (!inSameVoiceChannel) {
        if (msg.channel instanceof TextChannel) {
            await msg.channel.send(lang.EN.QUEUE.NOT_IN_SAME_CHANNEL);
        }
        return;
    }

    if (!queue.deleted) {
        queue.delete();
        resetActivity(msg.client);
    }
}
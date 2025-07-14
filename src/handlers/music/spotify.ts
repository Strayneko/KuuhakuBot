import { Message } from "discord.js";
import playMusicHandler from "../play_music_handler";

export default async function spotifyMusicHandler(msg: Message, cmdArg: string) {
    await playMusicHandler(msg, cmdArg, "spotify");
}
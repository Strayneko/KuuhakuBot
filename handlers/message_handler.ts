import { Message } from "discord.js";
import config from "../config/config";
import type CommandType from "../types/command";
import playMusicHandler from "./play_music_handler";

export default function messageHandler(msg: Message) {
    if (config.BOT_ID === msg.author.id) return;

    const cmdMessage: string = msg.content.split(" ").pop() ?? ""
    
    for(let cmd of getCommandList()) {
        if (isValidCommand(cmdMessage, cmd.name, cmd.shortName)) {
            cmd.handler(msg)
        }
    }
}

function getCommandList(): CommandType[] {
    return [
        {
            name: 'play',
            shortName: 'p',
            handler: playMusicHandler
        },
    ];
}

function isValidCommand(command: string, name: string, shortName: string): boolean {
    if (command.length === 0) return false;
    
    command = command.replace(config.BOT_PREFIX, '').trim();
    if (command.length === 0) return false;

    if (![name, shortName].includes(command)) return false;

    return true;
}
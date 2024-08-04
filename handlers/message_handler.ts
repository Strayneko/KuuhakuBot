import { Message } from "discord.js";
import config from "@/config/config";
import type CommandType from "@/types/command";
import playMusicHandler from "@/handlers/play_music_handler";
import queueListHandler from "@/handlers/queue_list_handler"
import queueSkipHandler from "./queue_skip_handler";
import queueStopHandler from "./queue_stop_handler";
import queuePauseHandler from "./queue_pause_handler";
import queueResumeHandler from "./queue_resume_handler";
import trackInfoHandler from "./track_info_handler";

export default async function messageHandler(msg: Message) {
    if (config.BOT_ID === msg.author.id) return;

    const cmdMessage: string = msg.content.split(" ").shift() || ""
    
    for(let cmd of getCommandList()) {
        if (isValidCommand(cmdMessage, cmd.name, cmd.shortName)) {
            const cmdArg = msg.content.replace(`${config.BOT_PREFIX}${cmd.name}`, '').replace(`${config.BOT_PREFIX}${cmd.shortName}`, '').trim()
            await cmd.handler(msg, cmdArg)
        }
    }
}

function getCommandList(): CommandType[] {
    return [
        {
            name: 'play',
            shortName: 'p',
            handler: playMusicHandler,
        },
        {
            name: 'queue',
            shortName: 'que',
            handler: queueListHandler,
        },
        {
            name: 'skip',
            shortName: 'skp',
            handler: queueSkipHandler,
        },
        {
            name: 'stop',
            shortName: 'stp',
            handler: queueStopHandler,
        },
        {
            name: 'pause',
            shortName: 'pse',
            handler: queuePauseHandler,
        },
        {
            name: 'resume',
            shortName: 'rsm',
            handler: queueResumeHandler,
        },
        {
            name: 'info',
            shortName: 'info',
            handler: trackInfoHandler,
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
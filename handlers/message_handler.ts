import { Message } from "discord.js";
import config from "@/config/config";
import getCommandList from "@/utils/get_command_list";


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

function isValidCommand(command: string, name: string, shortName: string): boolean {
    if (command.length === 0) return false;
    
    command = command.replace(config.BOT_PREFIX, '').trim();
    if (command.length === 0) return false;

    if (![name, shortName].includes(command)) return false;

    return true;
}
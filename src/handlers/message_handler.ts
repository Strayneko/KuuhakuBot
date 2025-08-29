import { Message } from "discord.js";
import config from "@/config/config";
import getCommandList from "@/utils/get_command_list";
import { findCommand, extractCommandArgs } from "@/services/command_service";

/**
 * Main message handler that processes incoming messages
 * @param msg The Discord message object
 */
export async function handleCommand(msg: Message): Promise<void> {
    // Ignore messages from the bot itself
    if (config.BOT_ID === msg.author.id) return;

    // Extract command from message
    const cmdMessage: string = msg.content.split(" ").shift() || "";
    
    // Find matching command
    const command = findCommand(cmdMessage, getCommandList(), config.BOT_PREFIX);
    if (!command) return;

    // Extract arguments
    const cmdArg = extractCommandArgs(msg.content, command.name, command.shortName, config.BOT_PREFIX);
    
    // Execute command handler
    try {
        await command.handler(msg, cmdArg);
    } catch (error) {
        console.error(`Error executing command ${command.name}:`, error);
        // Optionally send error message to user
    }
}
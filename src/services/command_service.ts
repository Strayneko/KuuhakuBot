import { CommandType } from "@/types/command";

/**
 * Finds a command that matches the given message
 * @param cmdMessage The command part of the message
 * @param commandList List of available commands
 * @param prefix The bot prefix
 * @returns The matching command or null if none found
 */
export function findCommand(
    cmdMessage: string, 
    commandList: CommandType[], 
    prefix: string
): CommandType | null {
    if (cmdMessage.length === 0) return null;
    
    for (const cmd of commandList) {
        const fullNames = [prefix + cmd.name, prefix + cmd.shortName];
        if (fullNames.includes(cmdMessage)) {
            return cmd;
        }
    }
    
    return null;
}

/**
 * Extracts command arguments from a message
 * @param content The full message content
 * @param name The command name
 * @param shortName The command short name
 * @param prefix The bot prefix
 * @returns The command arguments
 */
export function extractCommandArgs(
    content: string, 
    name: string, 
    shortName: string, 
    prefix: string
): string {
    return content
        .replace(`${prefix}${name}`, '')
        .replace(`${prefix}${shortName}`, '')
        .trim();
}
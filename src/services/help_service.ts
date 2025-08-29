/**
 * Formats the command list for display in the help message
 * @param commands Array of command objects
 * @param prefix The bot prefix
 * @returns Formatted string of commands
 */
export function formatCommandList(
    commands: { name: string; shortName: string; description: string }[], 
    prefix: string
): string {
    return commands
        .map((cmd, i) => {
            return `**${i + 1}.** \`${prefix}${cmd.name}\` or \`${prefix}${cmd.shortName}\` -- ${cmd.description}`;
        })
        .join("\n");
}
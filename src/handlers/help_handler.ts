import config from "@/config/config";
import getCommandList from "@/utils/get_command_list";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { formatCommandList } from "@/services/help_service";

/**
 * Handler for the help command
 * Displays a list of available commands
 * @param msg The Discord message object
 * @param cmdArg Command arguments (not used for help)
 */
export default function helpHandler(msg: Message, cmdArg: string): void {
    const commandList = formatCommandList(getCommandList(), config.BOT_PREFIX);
    
    const embed = new EmbedBuilder({
        color: config.EMBED_COLOR.Primary,
        title: 'Available Commands',
        description: commandList,
    });

    (msg.channel as TextChannel).send({ embeds: [embed] });
}
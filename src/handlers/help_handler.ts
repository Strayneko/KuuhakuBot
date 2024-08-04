import config from "@/config/config";
import getCommandList from "@/utils/get_command_list";
import { EmbedBuilder, Message } from "discord.js";

export default function helpHandler(msg: Message, cmdArg: string) {
    const commandList = getCommandList().map((cmd, i) => {
        return  `**${i + 1}.** \`${config.BOT_PREFIX}${cmd.name}\` or \`${config.BOT_PREFIX}${
            cmd.shortName
          }\` -- ${cmd.description}`;
    }).join("\n");

    const embed = new EmbedBuilder({
        color: config.EMBED_COLOR.Primary,
        title: 'Avaialle Commands',
        description: commandList,
    });

    msg.channel.send({ embeds: [embed] });
}
import type { Message } from "discord.js"

export interface CommandType {
    name: string
    shortName: string
    description: string
    handler: (msg: Message, cmdArg: string) => void | Promise<void>
}
import { ActivityType, Client } from "discord.js";

export default function resetActivity(client: Client): void {
    client.user?.setActivity({
        name: "Waiting No game no life season 2",
        type: ActivityType.Custom,
    })
}
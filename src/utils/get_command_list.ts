import type CommandType from "@/types/command";
import playMusicHandler from "@/handlers/play_music_handler";
import queueListHandler from "@/handlers/queue_list_handler"
import queueSkipHandler from "@/handlers/queue_skip_handler";
import queueStopHandler from "@/handlers/queue_stop_handler";
import queuePauseHandler from "@/handlers/queue_pause_handler";
import queueResumeHandler from "@/handlers/queue_resume_handler";
import trackInfoHandler from "@/handlers/track_info_handler";
import helpHandler from "@/handlers/help_handler";
import joinVoiceChannelHandler from "@/handlers/join_voice_channel_handler";
import leaveVoiceChannelHandler from "@/handlers/leave_voice_channel_handler";

export default function getCommandList(): CommandType[] {
    return [
        {
            name: 'play',
            shortName: 'p',
            description: 'Play music from youtube or youtube playlist',
            handler: playMusicHandler,
        },
        {
            name: 'queue',
            shortName: 'que',
            description: 'Queue list',
            handler: queueListHandler,
        },
        {
            name: 'skip',
            shortName: 'skp',
            description: 'Skip current song',
            handler: queueSkipHandler,
        },
        {
            name: 'stop',
            shortName: 'stp',
            description: 'Stop and clear queue',
            handler: queueStopHandler,
        },
        {
            name: 'pause',
            shortName: 'pse',
            description: 'Pause current song',
            handler: queuePauseHandler,
        },
        {
            name: 'resume',
            shortName: 'rsm',
            description: 'Resume current song',
            handler: queueResumeHandler,
        },
        {
            name: 'info',
            shortName: 'inf',
            description: 'Current song player info',
            handler: trackInfoHandler,
        },
        {
            name: 'help',
            shortName: 'hlp',
            description: 'Show this menu',
            handler: helpHandler,
        },
        {
            name: 'join',
            shortName: 'jn',
            description: 'Invite bot to voice channel',
            handler: joinVoiceChannelHandler
        },
        {
            name: 'leave',
            shortName: 'lv',
            description: 'Kick bot from voice channel',
            handler: leaveVoiceChannelHandler
        },
    ];
}

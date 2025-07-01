import config from "./config"

const EN = {
    YT_SEARCH: {
        FAILED: `:sob: ${config.BOT_NAME} can't access youtube right now.`,
        NO_RESULT: `:sob: ${config.BOT_NAME} can't find your request on youtube.`,
        SEARCHING: `:mag_right: ${config.BOT_NAME} is looking for your request.`,
        NO_ARGUMENT: `:sob: Please provide ${config.BOT_NAME} the query to search.`,
    },
    YTDL: {
        NO_AUDIO_FORMATS: `:sob: No audio format for this youtube video, ${config.BOT_NAME} can't sing at the moment.`
    },
    VOICE: {
        NOT_CONNECTED: `:sneeze: You have to join the voice channel if you want to hear ${config.BOT_NAME} sing.`,
        LEFT: `:wave: Bye byeee, see you next time.`,
        JOINED: `:partying_face: Hello!, give ${config.BOT_NAME} some song to sing.`,
    },
    QUEUE: {
        NO_QUEUE: `:pleading_face: ${config.BOT_NAME} didn't have anything in request list.`,
        STOP: `:triumph: Okay, ${config.BOT_NAME} stopped singing and cleared the request list. See you next time :wave:`,
        PAUSED: `:saluting_face: ${config.BOT_NAME} will stopped singing for a moment.`,
        RESUMED: `:partying_face: ${config.BOT_NAME} continued singing.`,
        EMPTY: `:triumph: ${config.BOT_NAME} stopped singing because ${config.BOT_NAME} request list was empty.`,
        BUFFERING: `:two_oclock: ${config.BOT_NAME} is loading your request.`,
        NOT_IN_SAME_CHANNEL: `:triumph: You must join the same voice channel as ${config.BOT_NAME}.`,
        MISSING_REPEAT_ARG: `:nerd: Please provide arguments for ${config.BOT_NAME} to loop ON or OFF`,
        SAME_REPEAT_ARG: `:face_with_monocle: ${config.BOT_NAME} already set the loop mode to `,
        REPEAT_MODE_ON: `:repeat: ${config.BOT_NAME} enabled looping on this queue.`,
        REPEAT_MODE_OFF: `:arrow_forward: ${config.BOT_NAME} disabled looping on this queue.`,
        SHUFFLED: `:shaking_face: ${config.BOT_NAME} shuffled the queue, check queue list to verify.`,
    },
    PLAYER: {
        ERROR: `:sob: Unable to extract song info. Therefore, ${config.BOT_NAME} is unable to sing this song at the moment.`
    },
}

export default { EN }
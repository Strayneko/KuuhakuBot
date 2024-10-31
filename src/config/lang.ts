const EN = {
    YT_SEARCH: {
        FAILED: ":sob: Shiro can't access youtube right now.",
        NO_RESULT: ":sob: Shiro can't find your request on youtube.",
        SEARCHING: ":mag_right: Shiro is looking for your request.",
        NO_ARGUMENT: ":sob: Please provide Shiro the query to search.",
    },
    YTDL: {
        NO_AUDIO_FORMATS: ":sob: No audio format for this youtube video, Shiro can't sing at the moment."
    },
    VOICE: {
        NOT_CONNECTED: ":sneeze: You have to join the voice channel if you want to hear Shiro sing.",
        LEFT: ":wave: Bye byeee, see you next time.",
        JOINED: ":partying_face: Hello!, give Shiro some song to sing.",
    },
    QUEUE: {
        NO_QUEUE: ":pleading_face: Shiro didn't have anything in request list.",
        STOP: ":triumph: Okay, Shiro stopped singing and cleared the request list. See you next time :wave:",
        PAUSED: ":saluting_face: Shiro will stopped singing for a moment.",
        RESUMED: ":partying_face: Shiro continued singing.",
        EMPTY: ":triumph: Shiro stopped singing because Shiro request list was empty.",
        BUFFERING: ":two_oclock: Shiro is loading your request.",
        NOT_IN_SAME_CHANNEL: ":triumph: You must join the same voice channel as Shiro.",
        MISSING_REPEAT_ARG: ":nerd: Please provide arguments for Shiro to loop ON or OFF",
        SAME_REPEAT_ARG: ":face_with_monocle: Shiro already set the loop mode to ",
        REPEAT_MODE_ON: ":repeat: Shiro enabled looping on this queue.",
        REPEAT_MODE_OFF: ":arrow_forward: Shiro disabled looping on this queue.",
        SHUFFLED: ":shaking_face: Shiro shuffled the queue, check queue list to verify.",
    },
    PLAYER: {
        ERROR: ":sob: Unable to extract song info. Therefore, Shiro is unable to sing this song at the moment."
    },
}

export default { EN }
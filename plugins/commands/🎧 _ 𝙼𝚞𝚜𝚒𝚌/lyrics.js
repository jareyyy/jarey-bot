import axios from 'axios';

const config = {
    name: "lyrics",
    aliases: ["lyric"],
    description: "Fetch lyrics for a song",
    usage: "[song-name]",
    cooldown: 5,
    permissions: [0, 1],
    isAbsolute: false,
    isHidden: false,
    credits: "coffee",
};

const apiConfig = {
    name: "Primary API",
    url: (songName) => `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`,
};

async function fetchLyrics(message, songName) {
    const { name, url } = apiConfig;
    const apiUrl = url(songName);

    try {
        const response = await axios.get(apiUrl);
        const { lyrics, title, artist } = response.data;

        if (!lyrics) {
            throw new Error("Lyrics not found");
        }

        sendFormattedLyrics(message, title, artist, lyrics);
    } catch (error) {
        console.error(`Error fetching lyrics from ${name} for "${songName}":`, error.message || error);
        message.send(`Sorry, there was an error getting the lyrics for "${songName}"!`);
    }
}

function sendFormattedLyrics(message, title, artist, lyrics) {
    const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n━━━━━━━━━━━━━━━━\n${lyrics}\n━━━━━━━━━━━━━━━━`;
    message.send(formattedLyrics);
}

async function onCall({ message, args }) {
    const songName = args.join(" ").trim();
    if (!songName) {
        message.send("Please provide a song name!");
        return;
    }

    await fetchLyrics(message, songName);
}

export default {
    config,
    onCall
};
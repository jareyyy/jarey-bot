import axios from 'axios';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yts from 'yt-search';

const config = {
    name: "play",
    aliases: ["playyt"],
    version: "1.0.0",
    credits: "Your_Name",
    description: "Play a song from YouTube",
    usages: "<song-name>",
    category: "Music",
    cooldown: 10
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cacheFolder = `${__dirname}/cache`;

// Function to create the cache folder if it doesn't exist
async function ensureCacheFolderExists() {
    try {
        await fs.ensureDir(cacheFolder);
    } catch (error) {
        console.error('Error creating cache folder:', error);
    }
}

// Main function to handle music search and download
async function onCall({ message, args }) {
    const { messageID, threadID } = message;
    const songTitle = args.join(" ");

    if (!songTitle) {
        return message.send(`❌ Please enter a music name!`);
    }

    try {
        await ensureCacheFolderExists();
        await message.react("⌛");

        const searchResults = await yts(songTitle);
        const firstResult = searchResults.videos[0];

        if (!firstResult) {
            return message.send(`❌ | No results found for "${songTitle}".`);
        }

        const { title, url } = firstResult;
        await message.send(`⏱️ | Music Title has been Found: "${title}". Downloading...`);

        const downloadLink = (await axios.get(`https://ccprojectsjonellproject.vercel.app/api/dl?url=${url}`)).data.data.downloadLink.url;
        const filePath = await downloadTrack(downloadLink);

        await message.reply({
            body: `🎵 Playing: "${title}"\nYouTube Link: ${url}`,
            attachment: fs.createReadStream(filePath)
        });

        fs.unlinkSync(filePath);
        await message.react("✅"); // React with ✅ on success
    } catch (error) {
        console.error("Error occurred:", error);
        await message.send(`❌ | An error occurred: ${error.message}`);
    }
}

// Function to download the track
async function downloadTrack(url) {
    const response = await axios.get(url, { responseType: 'stream' });
    const filePath = `${cacheFolder}/${Date.now()}.mp3`;

    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        response.data.pipe(writeStream);
        writeStream.on('finish', () => resolve(filePath));
        writeStream.on('error', reject);
    });
}

export default {
    config,
    onCall
};

import axios from 'axios';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yts from 'yt-search';

const config = {
    name: "play",
    aliases: ["play"],
    version: "1.0.0",
    info: "Get music",
    cooldown: 10,
    dev: "Jonell Magallanes"
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const cacheFolder = `${__dirname}/cache`;

// Ensure cache folder exists
async function ensureCacheFolderExists() {
    try {
        await fs.ensureDir(cacheFolder);
    } catch (error) {
        console.error('Error creating cache folder:', error);
    }
}

// Main function to handle music search and download
async function onCall({ api, event, target }) {
    if (!event) {
        console.error("Event is undefined");
        return;
    }

    const { threadID } = event;
    if (!target[0]) {
        return api.sendMessage(`❌ Please enter a music name!`, threadID);
    }

    const song = target.join(" ");
    const findingMessage = await api.sendMessage(`🔍 | Finding "${song}". Please wait...`, threadID);

    try {
        await ensureCacheFolderExists();
        const firstResult = (await yts(song)).videos[0];

        if (!firstResult) {
            return api.editMessage(`❌ | No results found for "${song}".`, findingMessage.messageID, threadID);
        }

        const { title, url } = firstResult;
        await api.editMessage(`⏱️ | Music Title has been Found: "${title}". Downloading...`, findingMessage.messageID);

        const downloadLink = (await axios.get(`https://ccprojectsjonellproject.vercel.app/api/dl?url=${url}`)).data.data.downloadLink.url;
        const filePath = await downloadTrack(downloadLink);

        await api.sendMessage({
            body: `🎵 Music Player\nHere is your music about your search "${song}"\n\nTitle: ${title}\nYoutube Link: ${url}`,
            attachment: fs.createReadStream(filePath)
        }, threadID);

        fs.unlinkSync(filePath);
        api.unsendMessage(findingMessage.messageID);
    } catch (error) {
        console.error(error);
        await api.editMessage(`❌ | ${error.message}`, findingMessage.messageID, threadID);
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

import axios from 'axios';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const config = {
    name: "play",
    aliases: ["play"],
    version: "1.0.0",
    info: "Get music",
    cooldown: 10,
    dev: "Jonell Magallanes"
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

async function onCall({ api, event, target }) {
    const { threadID } = event;

    if (!target[0]) {
        return api.sendMessage(`❌ Please enter a music name!`, threadID);
    }

    const song = target.join(" ");
    const findingMessage = await api.sendMessage(`🔍 | Finding "${song}". Please wait...`, threadID);

    try {
        // Ensure that the cache folder exists
        await ensureCacheFolderExists();

        const searchResults = await yts(song);
        const firstResult = searchResults.videos[0];

        if (!firstResult) {
            await api.editMessage(`❌ | No results found for "${song}".`, findingMessage.messageID, threadID);
            return;
        }

        const { title, url } = firstResult;
        await api.editMessage(`⏱️ | Music Title has been Found: "${title}". Downloading...`, findingMessage.messageID);

        const response = await axios.get(`https://ccprojectsjonellproject.vercel.app/api/dl?url=${url}`);
        const downloadLink = response.data.data.downloadLink.url;

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

async function downloadTrack(url) {
    const response = await axios.get(url, { responseType: 'stream' });
    const filePath = `${cacheFolder}/${Date.now()}.mp3`;

    const writeStream = fs.createWriteStream(filePath);
    response.data.pipe(writeStream);

    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve(filePath));
        writeStream.on('error', reject);
    });
}

export default {
    config,
    onCall
};

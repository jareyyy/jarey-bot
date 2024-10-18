import fs from 'fs-extra';
import path from 'path';
import yts from 'yt-search';
import ytdl from '@distube/ytdl-core';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const config = {
    name: "video",
    usedby: 0,
    version: "1.0.0",
    info: "Get video",
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 10
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cacheFolder = path.join(__dirname, 'cache');

// Function to create the cache folder if it doesn't exist
async function ensureCacheFolderExists() {
    try {
        await fs.ensureDir(cacheFolder);
    } catch (error) {
        console.error('Error creating cache folder:', error);
    }
}

async function onCall({ api, event, target }) {
    if (!target[0]) {
        return api.sendMessage(`❌ Please enter a video name!`, event.threadID);
    }

    try {
        await ensureCacheFolderExists();
        const videoQuery = target.join(" ");
        const findingMessage = await api.sendMessage(`🔍 | Finding "${videoQuery}". Please wait...`, event.threadID);

        const searchResults = await yts(videoQuery);
        const firstResult = searchResults.videos[0];

        if (!firstResult) {
            await api.editMessage(`❌ | No results found for "${videoQuery}".`, findingMessage.messageID, event.threadID);
            return;
        }

        const { title, url } = firstResult;

        await api.editMessage(`⏱️ | Video Title has been Found: "${title}". Downloading...`, findingMessage.messageID);

        const filePath = path.resolve(cacheFolder, `${Date.now()}-${title}.mp4`);

        const videoStream = ytdl(url, {
            filter: format => format.hasAudio && format.hasVideo,
            quality: 'highest',
            highWaterMark: 1 << 25
        });

        const fileStream = fs.createWriteStream(filePath);
        videoStream.pipe(fileStream);

        fileStream.on('finish', async () => {
            const bold = global.fonts.bold("Video Player");
            await api.sendMessage({
                body: `🎥 ${bold}\n${global.line}\nHere is your video based on your search "${videoQuery}"\n\nTitle: ${title}\nYoutube Link: ${url}`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID);

            fs.unlinkSync(filePath);
            api.unsendMessage(findingMessage.messageID);
        });

        videoStream.on('error', async (error) => {
            console.error(error);
            await api.editMessage(`❌ | ${error.message}`, findingMessage.messageID, event.threadID);
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error(error);
        await api.editMessage(`❌ | ${error.message}`, findingMessage.messageID, event.threadID);
    }
}

export default {
    config,
    onCall
};

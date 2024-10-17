import axios from 'axios';
import request from 'request';
import fs from 'fs';

const config = {
    name: "shoti",
    version: "1",
    permissions: [0],
    credits: "Ralph",
    description: "Shoti Command",
    commandCategory: "media",
    cooldown: 5,
};

const apiConfig = {
    name: "Shoti API",
    url: () => 'https://jeka-api.luabot24.repl.co/shoti/?apikey=geloo',
};

async function sendVideo(message) {
    const { name, url } = apiConfig;
    const apiUrl = url();

    message.send(`⏱️ | Video is sending please wait.`);

    try {
        const response = await axios.get(apiUrl);
        const ext = response.data.url.substring(response.data.url.lastIndexOf(".") + 1);
        const videoPath = `${__dirname}/cache/shoti.${ext}`;

        const callback = () => {
            message.send({
                body: `random bebegurl sa tiktok`,
                attachment: fs.createReadStream(videoPath)
            }, () => fs.unlinkSync(videoPath));
        };

        request(response.data.url).pipe(fs.createWriteStream(videoPath)).on("close", callback);
    } catch (error) {
        console.error(`Error fetching video from ${name}:`, error.message || error);
        message.send("API error status: 200");
        message.setReaction("😢");
    }
}

async function onCall({ message }) {
    await sendVideo(message);
}

export default {
    config,
    onCall
};

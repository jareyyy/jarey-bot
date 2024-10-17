import axios from 'axios';
import fs from 'fs';
import path from 'path';

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
    url: () => 'https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu',
};

const cachePath = './cache'; // Ensure this directory exists

async function sendVideo(message) {
    const { name } = apiConfig;
    const apiUrl = apiConfig.url();

    message.send(`⏱️ | Video is sending, please wait.`);

    try {
        const response = await axios.get(apiUrl);
        
        // Log the response to see its structure
        console.log("API Response:", response.data);

        // Check if the shotiurl exists in the response
        if (!response.data || !response.data.shotiurl) {
            throw new Error("shotiurl not found in the API response.");
        }

        const videoUrl = response.data.shotiurl;
        const ext = videoUrl.substring(videoUrl.lastIndexOf(".") + 1);
        const videoPath = path.join(cachePath, `shoti.${ext}`);

        // Log the video URL and path
        console.log("Downloading video from:", videoUrl);
        console.log("Saving video to:", videoPath);

        // Use Axios to download the video
        const writer = fs.createWriteStream(videoPath);
        const responseVideo = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream',
        });

        responseVideo.data.pipe(writer);

        writer.on('finish', () => {
            message.send({
                body: `Here is your video from TikTok!`,
                attachment: fs.createReadStream(videoPath)
            }, (err) => {
                if (err) {
                    console.error("Error sending video:", err);
                } else {
                    console.log("Video sent successfully.");
                }
                fs.unlinkSync(videoPath); // Clean up the file after sending
            });
        });

        writer.on('error', (err) => {
            console.error("Error writing video to file:", err);
            message.send("Failed to save the video.");
        });

    } catch (error) {
        console.error(`Error fetching video from ${name}:`, error.message || error);
        message.send("API error status: 200");
        
        // Check if setReaction exists before calling it
        if (typeof message.setReaction === 'function') {
            message.setReaction("😢");
        }
    }
}

async function onCall({ message }) {
    await sendVideo(message);
}

export default {
    config,
    onCall
};

import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

const config = {
    name: "shoti",
    version: "1.0.0",
    permissions: [0],
    credits: "libyzxy0",
    description: "Generate a random tiktok video.",
    commandCategory: "Entertainment",
    cooldown: 0,
};

const apiConfig = {
    name: "Shoti API",
    url: () => 'https://shoti-server-v2.onrender.com/api/v1/get',
    apiKey: 'shoti-1hfnksfp3ek6aidop7g',
};

const cachePath = './cache/shoti'; // Ensure this directory exists

// Function to create the cache folder if it doesn't exist
async function ensureCacheFolderExists() {
    try {
        await fs.ensureDir(cachePath);
    } catch (error) {
        console.error('Error creating cache folder:', error);
    }
}

async function sendVideo({ api, event, args }) {
    const { name } = apiConfig;
    const apiUrl = apiConfig.url();

    api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
    api.sendTypingIndicator(event.threadID, true);

    try {
        const response = await axios.post(apiUrl, { apikey: apiConfig.apiKey });

        // Log the response to see its structure
        console.log("API Response:", response.data);

        // Check if the video URL exists in the response
        if (!response.data || !response.data.data.url) {
            throw new Error("videoUrl not found in the API response.");
        }

        const videoUrl = response.data.data.url;
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
            // Prepare the message object
            const messageBody = {
                body: `Downloaded Successfull(y). \n\nuserName : \n\n@${response.data.data.user.username} \n\nuserNickname : \n\n${response.data.data.user.nickname} \n\nuserID : \n\n${response.data.data.user.userID} \n\nDuration : \n\n${response.data.data.duration}`,
                attachment: fs.createReadStream(videoPath)
            };

            // Log the message object before sending
            console.log("Sending message:", messageBody);

            api.sendMessage(messageBody, event.threadID, (err) => {
                if (err) {
                    console.error("Error sending video:", err);
                } else {
                    console.log("Video sent successfully.");
                }
                fs.unlinkSync(videoPath); // Clean up the file after sending
                api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            });
        });

        writer.on('error', (err) => {
            console.error("Error writing video to file:", err);
            api.sendMessage("Failed to save the video.", event.threadID);
        });

    } catch (error) {
        console.error(`Error fetching video from ${name}:`, error.message || error);
        api.sendMessage("API error status: 200", event.threadID);
    }
}

async function onCall({ api, event, args }) {
    await ensureCacheFolderExists(); // Ensure cache folder exists
    await sendVideo({ api, event, args });
}

export default {
    config,
    onCall
};

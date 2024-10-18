import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

const config = {
  name: "shoti",
  version: "1",
  permissions: [0],
  credits: "jarey",
  description: "Shoti Command",
  commandCategory: "media",
  cooldown: 5,
};

const apikey = 'shoti-0c84a66d4efac6d30bd14600d604e134fa513aef0098f4b4403cd73e10cea235984c607ee279236eef4f7d3807eaa7a57259592f140bb92897a9e39432ba18d557ead768f67babc6d9c9152c9cd6b69ed12599b723';

const apiConfig = {
  name: "Video API",
  url: () => 'https://shoti.kenliejugarap.com/getvideo.php?apikey=${apikey}',
};

const cachePath = './cache'; // Ensure this directory exists

// Function to create the cache folder if it doesn't exist
async function ensureCacheFolderExists() {
  try {
    await fs.ensureDir(cachePath);
  } catch (error) {
    console.error('Error creating cache folder:', error);
  }
}

// Function to download the video
async function downloadVideo(videoUrl, videoPath) {
  const writer = fs.createWriteStream(videoPath);
  const response = await axios({
    url: videoUrl,
    method: 'GET',
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Main function to send video
async function sendVideo(message) {
  if (!message || !message.threadID) {
    console.error("Invalid message object or missing ThreadID.");
    return;
  }

  const apiUrl = apiConfig.url();
  await message.send(`⏱️ | Video is sending, please wait.`);

  try {
    const response = await axios.get(apiUrl);
    console.log("API Response:", response.data);

    const videoUrl = response.data?.shotiurl;
    if (!videoUrl) {
      throw new Error("shotiurl not found in the API response.");
    }

    const ext = path.extname(videoUrl);
    const videoPath = path.join(cachePath, `video${ext}`);

    console.log("Downloading video from:", videoUrl);
    await downloadVideo(videoUrl, videoPath);
    console.log("Video downloaded to:", videoPath);

    // Extract additional information from the API response
    const { username, nickname, duration, title } = response.data;

    // Create the message body with additional details
    const messageBody = `
      Here is your video!
        Title: ${title || 'No title'}
        Username: ${username}
        Nickname: ${nickname}
        Duration: ${duration} seconds
    `;

    await message.send({
      body: messageBody,
      attachment: fs.createReadStream(videoPath)
    });

    console.log("Video sent successfully.");
    fs.unlinkSync(videoPath); // Clean up the file after sending

  } catch (error) {
    console.error(`Error fetching video from ${apiConfig.name}:`, error.message);
    await message.send("Failed to fetch the video. Please try again later.");
    
    if (typeof message.setReaction === 'function') {
      message.setReaction("😢");
    }
  }
}

async function onCall({ message }) {
  await ensureCacheFolderExists(); // Ensure cache folder exists
  await sendVideo(message);
}

export default {
  config,
  onCall
};

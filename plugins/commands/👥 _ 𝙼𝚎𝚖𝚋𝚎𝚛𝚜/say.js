import fs from 'fs-extra';
import axios from 'axios';
import { resolve } from 'path';

const config = {
    name: "say",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Yan Maglinte",
    description: "Text to voice speech messages",
    usePrefix: true, // SWITCH TO "false" IF YOU WANT TO DISABLE PREFIX
    commandCategory: "message",
    usage: `Text to speech messages`,
    cooldown: 5,
    dependencies: {
        "path": "",
        "fs-extra": ""
    }
};

async function onCall({ message, args, event }) {
    await message.react("🔊"); // Indicate processing

    try {
        const content = (event.type === "message_reply") ? event.messageReply.body : args.join(" ");
        const languageToSay = (["ru", "en", "ko", "ja", "tl"].some(item => content.indexOf(item) === 0)) 
            ? content.slice(0, content.indexOf(" ")) 
            : global.config.language;

        const msg = (languageToSay !== global.config.language) ? content.slice(3) : content;
        const path = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);

        await downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, path);

        await message.reply({
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (error) {
        console.error('Error:', error);
        await message.reply("An error occurred while processing your request."); // Error message
        await message.react("❎"); // React with ❎ on error
    }
}

async function downloadFile(url, path) {
    const response = await axios.get(url, { responseType: 'stream' });
    return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(path);
        response.data.pipe(stream);
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}

export default {
    config,
    onCall,
};

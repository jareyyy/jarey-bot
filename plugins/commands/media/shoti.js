// Import necessary modules
import axios from 'axios';
import fs from 'fs';
import request from 'request';

// Export module configuration
export const config = {
    name: "shoti",
    version: "1",
    hasPermission: 0, // Fixed typo: 'hasPermssion' to 'hasPermission'
    credits: "Ralph", 
    description: "Shoti Command",
    commandCategory: "media",
    cooldowns: 5
};

// Export the run function
export const run = async ({ api, event }) => {
    api.sendMessage(`⏱️ | Video is sending please wait.`, event.threadID, event.messageID);

    try {
        const res = await axios.get('https://jeka-api.luabot24.repl.co/shoti/?apikey=geloo');
        let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
        
        const callback = () => {
            api.sendMessage({
                body: `random bebegurl sa tiktok`,
                attachment: fs.createReadStream(__dirname + `/cache/shoti.${ext}`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/shoti.${ext}`), event.messageID);
        };

        request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/shoti.${ext}`)).on("close", callback);
    } catch (err) {
        api.sendMessage("API error status: 200", event.threadID, event.messageID);
        api.setMessageReaction("😢", event.messageID, (err) => {}, true);
    }
};

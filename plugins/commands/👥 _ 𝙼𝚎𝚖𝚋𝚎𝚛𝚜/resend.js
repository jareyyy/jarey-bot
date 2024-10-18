import axios from 'axios';
import { writeFileSync, createReadStream } from 'fs-extra';
import request from 'request';

const config = {
    name: "resend",
    version: "2.0.0",
    description: "Automatically resends messages when unsent",
    usage: "resend",
    cooldown: 0,
    permissions: [1],
    isHidden: true,
    credits: "Thọ & Mod By DuyVuong",
};

const logMessage = new Map();
let botID;

// Handle incoming events
async function handleEvent({ event, api, Users }) {
    const { messageID, senderID, threadID, body: content, type } = event;

    if (!botID) botID = await api.getCurrentUser ID();

    // Ignore messages sent by the bot itself
    if (senderID === botID) return;

    // Log the message if it’s not an unsent message
    if (type !== "message_unsend") {
        logMessage.set(messageID, { msgBody: content, attachment: event.attachments });
        return; // Exit after logging
    }

    // Handle unsent messages
    const getMsg = logMessage.get(messageID);
    if (!getMsg) return; // No logged message found

    const name = await Users.getNameUser (senderID);
    const msg = {
        body: `${name} unsent the message${getMsg.msgBody ? `:\n\n${getMsg.msgBody}` : ""}`,
        attachment: [],
        mentions: { tag: name, id: senderID },
    };

    // Process attachments if they exist
    if (getMsg.attachment && getMsg.attachment.length > 0) {
        await Promise.all(getMsg.attachment.map(async (attachment, index) => {
            const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
            const ext = attachment.url.split('.').pop();
            const path = `${__dirname}/cache/${index + 1}.${ext}`;
            writeFileSync(path, response.data);
            msg.attachment.push(createReadStream(path));
        }));
    }

    // Send the constructed message back to the thread
    api.sendMessage(msg, threadID);
}

// Export the module
export default {
    config,
    handleEvent,
};

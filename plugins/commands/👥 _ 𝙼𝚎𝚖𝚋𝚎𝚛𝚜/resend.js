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

// This function is called when a message event occurs
async function handleEvent({ event, api, Users }) {
    const { messageID, senderID, threadID, body: content } = event;

    if (!botID) botID = await api.getCurrentUser ID();

    // Ignore messages sent by the bot itself
    if (senderID === botID) return;

    // Log the message if it’s not an unsent message
    if (event.type !== "message_unsend") {
        logMessage.set(messageID, {
            msgBody: content,
            attachment: event.attachments,
        });
    }

    // Handle unsent messages
    if (event.type === "message_unsend") {
        const getMsg = logMessage.get(messageID);
        if (!getMsg) return;

        const name = await Users.getNameUser (senderID);
        if (!getMsg.attachment[0]) {
            return api.sendMessage(`${name} unsent the message \n\nContent: ${getMsg.msgBody}`, threadID);
        } else {
            await handleAttachments(getMsg, name, senderID, threadID, api);
        }
    }
}

// Function to handle attachments from unsent messages
async function handleAttachments(getMsg, name, senderID, threadID, api) {
    let num = 0;
    const msg = {
        body: `${name} unsent the message \n${getMsg.attachment.length} Attachments${getMsg.msgBody ? `\n\nContent: ${getMsg.msgBody}` : ""}`,
        attachment: [],
        mentions: { tag: name, id: senderID },
    };

    for (const attachment of getMsg.attachment) {
        num++;
        const getURL = await request.get(attachment.url);
        const pathname = getURL.uri.pathname;
        const ext = pathname.substring(pathname.lastIndexOf(".") + 1);
        const path = `${__dirname}/cache/${num}.${ext}`;
        const data = (await axios.get(attachment.url, { responseType: 'arraybuffer' })).data;
        writeFileSync(path, Buffer.from(data, "utf-8"));
        msg.attachment.push(createReadStream(path));
    }

    api.sendMessage(msg, threadID);
}

// Export the module with the config and event handler
export default {
    config,
    handleEvent,
};

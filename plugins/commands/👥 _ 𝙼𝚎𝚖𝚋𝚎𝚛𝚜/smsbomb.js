import axios from 'axios';
import pkg from 'fs-extra';
import request from 'request';

const { writeFileSync, createReadStream } = pkg;

const config = {
    name: 'smsbomb',
    version: '1.0.0',
    description: 'Send multiple SMS messages to a number with a delay',
    usage: 'smsbomb [number] [amount] [delay]',
    cooldown: 0,
    permissions: [1],
    credits: 'Deku (rest api)',
};

async function execute(senderId, args, pageAccessToken, sendMessage) {
    const [number, amount, delay] = args;

    if (!number || !amount || !delay) {
        sendMessage(senderId, { text: 'Usage: smsbomb [number] [amount] [delay]' }, pageAccessToken);
        return;
    }

    try {
        const apiUrl = `https://deku-rest-api-3ijr.onrender.com/smsb?number=${number}&amount=${amount}&delay=${delay}`;
        const response = await axios.get(apiUrl);
        
        const { status, success, fail } = response.data;
        if (status) {
            sendMessage(senderId, { text: `Successfully sent ${success} SMS messages to ${number}. ${fail} messages failed.` }, pageAccessToken);
        } else {
            sendMessage(senderId, { text: 'Failed to send SMS messages.' }, pageAccessToken);
        }
    } catch (error) {
        console.error('Error sending SMS messages:', error);
        sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
}

// The onCall function to handle incoming commands
async function onCall({ event, api }) {
    // Log the incoming event for debugging
    console.log('Received event:', event);

    // Validate the event object
    if (!event || !event.threadID || !event.senderID || !event.body) {
        console.error('Invalid event object:', event);
        return; // Exit if the event object is invalid
    }

    const { threadID, senderID, body } = event;
    const args = body.split(' ').slice(1); // Extract arguments from the command

    // Call the execute function with the relevant parameters
    await execute(senderID, args, event.pageAccessToken, api.sendMessage);
}

// Example of how to invoke onCall (this part should be in your message handling logic)
function handleIncomingMessage(event, api) {
    // Assuming this function is called when a new message is received
    onCall({ event, api }).catch(error => {
        console.error('Error in onCall:', error);
    });
}

// Simulating the message listener (replace this with your actual message listener)
function messageListener(api) {
    api.listen((event) => {
        // Call the message handler when a new message is received
        handleIncomingMessage(event, api);
    });
}

// Exporting the config and functions
export default {
    config,
    execute,
    onCall,
    handleIncomingMessage,
    messageListener,
};

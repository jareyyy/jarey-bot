import axios from 'axios';

// Configuration
const config = {
    name: 'smsbomb',
    version: '1.0.0',
    description: 'Send multiple SMS messages to a number with a delay',
    usage: 'smsbomb [number] [amount] [delay]',
    cooldown: 0,
    permissions: [1],
    credits: 'Deku (rest api)',
};

// Function to handle SMS bombing
async function execute(senderId, args, pageAccessToken, sendMessage) {
    const [number, amount, delay] = args;

    if (!number || !amount || !delay) {
        sendMessage(senderId, { text: 'Usage: smsbomb [number] [amount] [delay]' }, pageAccessToken);
        return;
    }

    try {
        const apiUrl = `https://deku-rest-apis.ooguy.com/smsb?number=${number}&amount=${amount}&delay=${delay}`;
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

// Function to handle incoming commands
async function onCall({ event, api }) {
    if (!event || !event.threadID || !event.senderID || !event.body) {
        console.error('Invalid event object:', event);
        return;
    }

    const { senderID, body } = event;
    const args = body.split(' ').slice(1);

    if (body.startsWith('smsbomb')) {
        await execute(senderID, args, event.pageAccessToken, api.sendMessage);
    }
}

// Simulating the message listener (replace this with your actual message listener)
function messageListener(api) {
    api.listen((event) => {
        onCall({ event, api }).catch(error => {
            console.error('Error in onCall:', error);
        });
    });
}

// Exporting the config and functions
export default {
    config,
    execute,
    onCall,
    messageListener,
};

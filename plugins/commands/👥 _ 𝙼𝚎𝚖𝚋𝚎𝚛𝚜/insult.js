const config = {
    name: "insultGenerator",
    aliases: ["insult"], // Name and alias are the same
    description: "Fetches a random insult.",
    usage: "[command]",
    cooldown: 5,
    permissions: [0], // Assuming 0 means no special permissions are required
    credits: "jarey"
}

async function fetchInsult() {
    const response = await fetch("https://deku-rest-apis.ooguy.com/insult");
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.insult; // Assuming the API returns an object with an 'insult' property
}

async function onCall({ message }) {
    const { senderID, mentions, reply, type } = message;
    
    // Determine the target for the insult
    const targetID = Object.keys(mentions).length === 0 
        ? (type === "message_reply" ? message.messageReply.senderID : senderID) 
        : Object.entries(mentions).map(e => `${e[1].replace(/@/g, '')} - ${e[0]}`).join("\n");

    try {
        const insult = await fetchInsult(); // Fetch the insult from the API
        reply(`Insult for ${targetID}:\n${insult}`); // Reply with the insult
    } catch (error) {
        reply("Sorry, I couldn't fetch an insult at this moment.");
        console.error(error); // Log the error for debugging
    }
}

export default {
    config,
    onCall
}

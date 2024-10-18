const config = {
    name: "Baybayin",
    aliases: ["baybay"], // Name and alias are the same
    description: "Fetches the translation for the phrase 'mahal kita'.",
    usage: "[query]",
    cooldown: 5,
    permissions: [0], // Assuming 0 means no special permissions are required
    credits: "XaviaTeam"
}

async function fetchBaybayTranslation() {
    const response = await fetch("https://deku-rest-apis.ooguy.com/api/baybay?q=mahal%20kita");
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.translation; // Assuming the API returns an object with a 'translation' property
}

async function onCall({ message }) {
    const { senderID, mentions, reply, type } = message;
    
    // Determine the target for the translation
    const targetID = Object.keys(mentions).length === 0 
        ? (type === "message_reply" ? message.messageReply.senderID : senderID) 
        : Object.entries(mentions).map(e => `${e[1].replace(/@/g, '')} - ${e[0]}`).join("\n");

    try {
        const translation = await fetchBaybayTranslation(); // Fetch the translation from the API
        reply(`Translation for ${targetID}:\n${translation}`); // Reply with the translation
    } catch (error) {
        reply("Sorry, I couldn't fetch the translation at this moment.");
        console.error(error); // Log the error for debugging
    }
}

export default {
    config,
    onCall
}

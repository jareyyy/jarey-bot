const config = {
    name: "bibleVerseGenerator",
    credits: "XaviaTeam"
}

async function fetchBibleVerse() {
    const response = await fetch("https://deku-rest-apis.ooguy.com/bible");
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.verse; // Assuming the API returns an object with a 'verse' property
}

async function onCall({ message }) {
    const { senderID, mentions, reply, type } = message;
    
    // Determine the target for the Bible verse
    const targetID = Object.keys(mentions).length === 0 
        ? (type === "message_reply" ? message.messageReply.senderID : senderID) 
        : Object.entries(mentions).map(e => `${e[1].replace(/@/g, '')} - ${e[0]}`).join("\n");

    try {
        const verse = await fetchBibleVerse(); // Fetch the Bible verse from the API
        reply(`Bible verse for ${targetID}:\n${verse}`); // Reply with the Bible verse
    } catch (error) {
        reply("Sorry, I couldn't fetch a Bible verse at this moment.");
        console.error(error); // Log the error for debugging
    }
}

export default {
    config,
    onCall
}

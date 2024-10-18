import axios from 'axios';

const config = {
    name: "bible",
    aliases: ["bible"],
    description: "Fetches a random Bible verse.",
    usage: "[command]",
    cooldown: 5,
    permissions: [0], // Assuming 0 means no special permissions are required
    credits: "jarey"
};

async function onCall({ message, args }) {
    // No additional arguments are needed for this command
    await message.react("📖"); // Indicate processing

    const apiUrl = "https://deku-rest-apis.ooguy.com/bible"; // API endpoint

    try {
        const response = await axios.get(apiUrl); // Fetching the Bible verse

        if (!response.data || !response.data.verse) {
            throw new Error("No verse found in the response");
        }

        const verse = response.data.verse; // Extracting the verse from the response
        await message.reply(`Here is a Bible verse:\n${verse}`); // Reply with the Bible verse
        await message.react("✅"); // React with ✅ on success
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        await message.react("❎"); // React with ❎ on error
        await message.reply("Sorry, I couldn't fetch a Bible verse at this moment."); // Error message
    }
}

export default {
    config,
    onCall,
};

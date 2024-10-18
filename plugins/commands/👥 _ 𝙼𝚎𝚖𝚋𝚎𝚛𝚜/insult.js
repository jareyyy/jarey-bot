import axios from 'axios';

const config = {
    name: "insult",
    aliases: ["insult"],
    description: "Fetches a random insult.",
    usage: "[command]",
    cooldown: 5,
    permissions: [0], // Assuming 0 means no special permissions are required
    credits: "jarey"
};

async function onCall({ message, args }) {
    // No additional arguments are needed for this command
    await message.react("😈"); // Indicate processing

    const apiUrl = "https://deku-rest-apis.ooguy.com/insult"; // API endpoint

    try {
        const response = await axios.get(apiUrl); // Fetching the insult

        if (!response.data || !response.data.insult) {
            throw new Error("No insult found in the response");
        }

        const insult = response.data.insult; // Extracting the insult from the response
        await message.reply(`Here is an insult:\n${insult}`); // Reply with the insult
        await message.react("✅"); // React with ✅ on success
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        await message.react("❎"); // React with ❎ on error
        await message.reply("Sorry, I couldn't fetch an insult at this moment."); // Error message
    }
}

export default {
    config,
    onCall,
};

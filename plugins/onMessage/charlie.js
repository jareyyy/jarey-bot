/**
 * Cautions:
 * - This plugin may cause your bot to be banned by Facebook because of spamming reactions.
 * - Use this plugin at your own risk.
 */

import axios from 'axios'; // Ensure you import the axios module for HTTP requests

export const config = {
    name: "charlie",
    version: "0.0.2",
    credits: "Your Name",
    description: "Send an image when Charlie is mentioned."
};

export async function onCall({ message }) {
    if (message.body.length === 0) return;

    // Check if "Charlie" is mentioned
    if (message.body.toLowerCase().includes("charlie")) {
        const imageUrl = "https://raw.githubusercontent.com/jareyyy/jarey-bot/be853326c2f59960b799e284c216b3916dd60236/plugins/onMessage/462551291_1691687854737625_6768399450712056614_n.jpg"; // Use the raw GitHub URL

        try {
            const response = await axios.get(imageUrl, { responseType: 'stream' });
            await message.reply({
                body: `Tanginamo Charlie!`,
                attachment: response.data
            });
        } catch (error) {
            console.error("Error downloading image: ", error);
            await message.reply("Sorry, the image is not available.");
        }
    }
}

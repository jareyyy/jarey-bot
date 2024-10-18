import axios from 'axios'; // Ensure you import the axios module for HTTP requests

export const config = {
    name: "tombeng",
    version: "0.0.2",
    credits: "Your Name",
    description: "Send an image when Tombeng or Ronmel is mentioned."
};

export async function onCall({ message }) {
    if (message.body.length === 0) return;

    // Check if "Tombeng" is mentioned
    if (message.body.toLowerCase().includes("tombeng")) {
        const imageUrl = "https://raw.githubusercontent.com/jareyyy/jarey-bot/991f812457790fb7cd0095fee7c18c4646b2fe6f/plugins/onMessage/462541951_3461524960810832_5622340254767523770_n.jpg"; // Updated URL for Tombeng

        try {
            const response = await axios.get(imageUrl, { responseType: 'stream' });
            if (response && response.data) {
                await message.reply({
                    body: `Tombeng??`,
                    attachment: response.data
                });
            } else {
                await message.reply("Sorry, the image for Tombeng is not available.");
            }
        } catch (error) {
            console.error("Error downloading image: ", error);
            await message.reply("Sorry, the image for Tombeng is not available.");
        }
    }

    // Check if "Ronmel" is mentioned
    if (message.body.toLowerCase().includes("ronmel")) {
        const ronmelImageUrl = "https://raw.githubusercontent.com/jareyyy/jarey-bot/991f812457790fb7cd0095fee7c18c4646b2fe6f/plugins/onMessage/462541951_3461524960810832_5622340254767523770_n.jpg"; // Updated URL for Ronmel

        try {
            const response = await axios.get(ronmelImageUrl, { responseType: 'stream' });
            if (response && response.data) {
                await message.reply({
                    body: `ronmel??`,
                    attachment: response.data
                });
            } else {
                await message.reply("Sorry, the image for Ronmel is not available.");
            }
        } catch (error) {
            console.error("Error downloading image: ", error);
            await message.reply("Sorry, the image for Ronmel is not available.");
        }
    }
}

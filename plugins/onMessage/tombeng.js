import axios from 'axios'; // Ensure you import the axios module for HTTP requests

export const config = {
    name: "tombeng", // Name remains "tombeng"
    version: "0.0.2",
    credits: "Your Name",
    description: "Send an image when Tombeng is mentioned." // Description remains the same
};

export async function onCall({ message }) {
    if (message.body.length === 0) return;

    // Check if "Tombeng" is mentioned
    if (message.body.toLowerCase().includes("tombeng")) {
        const imageUrl = "https://github.com/jareyyy/jarey-bot/blob/991f812457790fb7cd0095fee7c18c4646b2fe6f/plugins/onMessage/462541951_3461524960810832_5622340254767523770_n.jpg"; // Updated URL

        try {
            const response = await axios.get(imageUrl, { responseType: 'stream' });
            await message.reply({
                body: `Tombeng sino ba to??`, // Greeting remains the same
                attachment: response.data
            });
        } catch (error) {
            console.error("Error downloading image: ", error);
            await message.reply("Sorry, the image is not available.");
        }
    }
}

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
        const imageUrl = "https://raw.githubusercontent.com/jareyyy/jarey-bot/48144b85a0dc2c70464b409e6212cc026aa9a86f/plugins/onMessage/462541935_1260687348519189_238979517166631360_n.jpg"; // Updated raw GitHub URL

        try {
            const response = await axios.get(imageUrl, { responseType: 'stream' });
            await message.reply({
                body: `hi daddy Charlie!`,
                attachment: response.data
            });
        } catch (error) {
            console.error("Error downloading image: ", error);
            await message.reply("Sorry, the image is not available.");
        }
    }
}

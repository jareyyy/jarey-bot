/**
 * Cautions:
 * - This plugin may cause your bot to be banned by Facebook because of spamming reactions.
 * - Use this plugin at your own risk.
 */

export const config = {
    name: "charlie",
    version: "0.0.2",
    credits: "Your Name",
    description: "Send an image when Charlie is mentioned."
};

export function onCall({ message }) {
    if (message.body.length === 0) return;

    // Check if "Charlie" is mentioned
    if (message.body.toLowerCase().includes("charlie")) {
        const imageUrl = "https://example.com/path/to/your/image.jpg"; // Replace with your image URL
        return message.reply(`Tanginamo charlie!`, { attachment: imageUrl });
    }
}

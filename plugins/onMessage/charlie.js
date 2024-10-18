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
        const imageUrl = "https://github.com/jareyyy/jarey-bot/blob/be853326c2f59960b799e284c216b3916dd60236/plugins/onMessage/462551291_1691687854737625_6768399450712056614_n.jpg"; // Replace with your image URL
        return message.reply(`Tanginamo charlie!`, { attachment: imageUrl });
    }
}

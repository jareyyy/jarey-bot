/**
 * Cautions:
 * - This plugin may cause your bot to be banned by Facebook because of spamming reactions.
 * - Use this plugin at your own risk.
 */

export const config = {
    name: "autoreact",
    version: "0.0.1-xaviabot-port-refactor",
    credits: "Clarence DK",
    description: "Random letters heart react"
};

export function onCall({ message }) {
    if (message.body.length === 0) return;

    // Conditions for sadness
    const sadConditions = [
        "sakit", "saket", "peyn", "pain", "mamatay", "ayaw ko na", 
        "saktan", "sasaktan", "sad", "malungkot", " 😥", "😰", 
        "😨", "😢", ":(", "😔", "😞", "depress", "stress", 
        "depression", "kalungkutan", "😭"
    ];

    // Expanded conditions for love
    const loveConditions = [
        "love", "mahal", "sweet", "heart", "cherish", 
        "adore", "affection", "romance", "kilig", "hug", 
        "miss you", "tender", "beloved", "darling", "babe",
        "dear", "cutie", "angel", "sweety", "my love", 
        "precious", "soulmate", "passion", "cuddle", 
        "forever", "together", "my heart", "sweetheart", 
        "lovey", "love you", "I love you", "xoxo", 
        "kisses", "snuggle", "my everything", "beloved"
    ];

    // Conditions for anger (Filipino slang)
    const angryConditions = [
        "gago", "bobo", "tanga", "putang ina", "hayop", 
        "sira ulo", "pabibo", "pabebe", "ang sakit", 
        "ang init", "ang gulo", "kupal", "peste"
    ];

    // Check for anger
    if (angryConditions.some(word => message.body.toLowerCase().includes(word))) {
        return message.react("😠");
    }

    // Check for sadness
    if (sadConditions.some(word => message.body.toLowerCase().includes(word))) {
        return message.react("😢");
    }

    // Check for love
    if (loveConditions.some(word => message.body.toLowerCase().includes(word))) {
        return message.react("❤");
    }
}

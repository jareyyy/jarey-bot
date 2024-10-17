const config = {
    name: "translate",
    aliases: ['trans', 'dich'],
    description: "Translate text to the target language.",
    usage: '[lang] [text]',
    category: "𝙴𝚍𝚞𝚌𝚊𝚝𝚒𝚘𝚗",
    credits: 'XaviaTeam'
};

// Mapping language codes to full names
const langNames = {
    "sq": "Albanian",
    "af": "Afrikaans",
    "ar": "Arabic",
    "bn": "Bengali",
    "bs": "Bosnian",
    "my": "Burmese",
    "ca": "Catalan",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "et": "Estonian",
    "fil": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "hi": "Hindi",
    "hu": "Hungarian",
    "is": "Icelandic",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "kn": "Kannada",
    "km": "Khmer",
    "ko": "Korean",
    "la": "Latin",
    "lv": "Latvian",
    "ml": "Malayalam",
    "mr": "Marathi",
    "ne": "Nepali",
    "nb": "Norwegian",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "sr": "Serbian",
    "si": "Sinhalese",
    "sk": "Slovak",
    "es": "Spanish",
    "sw": "Swahili",
    "sv": "Swedish",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "vi": "Vietnamese"
};

const supportedLangs = Object.keys(langNames);

async function onCall({ message, args, getLang, data }) {
    const { reply, type } = message;

    const langInput = args[0]?.toLowerCase();
    const threadLang = (data?.thread?.data?.language || global.config.LANGUAGE)?.slice(0, 2);
    const targetLang = langInput || threadLang;
    const lang_to = supportedLangs.includes(targetLang) ? targetLang : "en";
    const text = type === "message_reply" ? message.messageReply.body : supportedLangs.includes(langInput) ? args.slice(1).join(" ") : args.join(" ");

    if (!text) return reply("Please enter the text you want to translate.");

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang_to}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const res = await GET(url);
        const translation = res.data[0].map(item => item[0]).join("");
        const lang_from = res.data[2];
        const fromName = langNames[lang_from] || lang_from;
        const toName = langNames[lang_to] || lang_to;

        reply(`
━━━━━━━━━━━━━━━━
Translate text from\n${fromName} to ${toName}

🪧 Translated text:
▫️${translation}
━━━━━━━━━━━━━━━━`);
    } catch (err) {
        console.error(err);
        reply("An error occurred.");
    }
}

export default {
    config,
    onCall
};
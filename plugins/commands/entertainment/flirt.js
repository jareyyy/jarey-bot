import { join } from "path";

const config = {
    name: "flirt",
    version: "0.0.1-xaviabot-port-refactor",
    credits: "Zeska fixed by Choru tiktokers",
    description: "Continuously tag the person you tag for many times to capture their heart.",
    usage: "[tag]",
    cooldown: 20
};

export async function onLoad() {
    // Any necessary preloading can be handled here if needed
}

export async function flirt(message, body, time) {
    return new Promise(resolve => {
        setTimeout(() => {
            message.send(body);
            resolve();
        }, time);
    });
}

export async function onCall({ message }) {
    const mention = Object.keys(message.mentions)[0];
    if (!mention) return message.reply("Tag someone to flirt with them! ( ͡° ͜ʖ ͡°)");

    const name = message.mentions[mention];
    const arraytag = [{
        id: mention,
        tag: name
    }];

    message.send("Start flirting!");

    const flirtMessages = [
        { body: "Psst crush po kita", time: 3000 },
        { body: "Hehehehe love u po", time: 5000 },
        { body: "Tara punta tayo parke dun tayo magpakasaya", time: 7000 },
        { body: "kumain ka naba? Pwede mo rin ako kainin, ugh ugh", time: 9000 },
        { body: `Ahhhhhh dahan dahan lang, makakarami din tayo ${name}`, time: 12000, mentions: arraytag },
        { body: "babe asan ka na, miss na kita", time: 15000 },
        { body: "gusto mo regaluhan kita mamaya ng matamis na chokolate?", time: 17000 },
        { body: "sarap mo po, tara istara isag round ulit", time: 20000 },
        { body: "lab lab kita, di kita iiwan pramis", time: 23000 },
        { body: "mwa mwa chup chup ugh ugh", time: 25000 },
        { body: "Grrrr */nagpapalambing, ako nalang tingnan mo wag na yang cellphone mo", time: 28500 },
        { body: "babe may sasabihin ako sayo.....", time: 31000 },
        { body: "Will you marry me?", time: 36000 },
        { body: "yieee happy anniversary babe", time: 39000 },
        { body: "wait kunin ko yung chocolate at roses ko para sayo, give me a minute", time: 40000 },
        { body: "Tada 💐🍫💐, Happy Anniversary ulit mahal", time: 65000 },
        { body: "After Many Years* \nBabe alam ko matanda nako malapit nako mawala..", time: 70000 },
        { body: "Pero tandaan mo kahit mawala ako mahal na mahal kita", time: 75000 },
        { body: "Babe paalam na.....", time: 80000 },
        { body: "salamat sa pakikipag flirt sa akin, ako ay masaya na...", time: 85000 },
        { body: "Good bye, see you in the next program.", time: 90000 },
    ];

    for (const { body, time, mentions } of flirtMessages) {
        await flirt(message, { body, mentions }, time);
    }
}

export default {
    config,
    onCall,
};

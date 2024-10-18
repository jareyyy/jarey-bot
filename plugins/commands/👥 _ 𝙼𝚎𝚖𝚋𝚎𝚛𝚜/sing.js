import fs from 'fs-extra';
import ytdl from '@distube/ytdl-core';
import Youtube from 'youtube-search-api';
import axios from 'axios';

const convertHMS = (value) => new Date(value * 1000).toISOString().slice(11, 19);

const config = {
    name: "sing",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Mirai Team & Yan Maglinte",
    description: "Play music via YouTube link or search keyword",
    usage: "[searchMusic]",
    cooldown: 0
};

async function downloadMusicFromYoutube(link) {
    try {
        const path = `${__dirname}/cache/audio-${Date.now()}.mp3`;
        const data = await ytdl.getInfo(link);
        const result = {
            title: data.videoDetails.title,
            dur: Number(data.videoDetails.lengthSeconds),
            viewCount: data.videoDetails.viewCount,
            likes: data.videoDetails.likes,
            author: data.videoDetails.author.name,
        };

        return new Promise((resolve, reject) => {
            ytdl(link, { filter: format => format.itag === 249 })
                .pipe(fs.createWriteStream(path))
                .on('finish', () => resolve({ data: path, info: result }))
                .on('error', reject);
        });
    } catch (e) {
        console.error('Error downloading music:', e);
        throw e;
    }
}

async function onCall({ message, args }) {
    if (!args?.length) {
        return message.reply('❯ Search cannot be empty!');
    }

    const keywordSearch = args.join(" ");
    await message.react("🎶"); // Indicate processing

    if (args[0]?.startsWith("https://")) {
        try {
            const { data, info } = await downloadMusicFromYoutube(args[0]);
            const body = `❍━━━━━━━━━━━━❍\n🎵 Title: ${info.title}\n⏱️ Time: ${convertHMS(info.dur)}\n❍━━━━━━━━━━━━❍`;

            if (fs.statSync(data).size > 26214400) {
                return message.reply('⚠️ The file could not be sent because it is larger than 25MB.');
            }

            return message.reply({ body, attachment: fs.createReadStream(data) }, () => {
                fs.unlinkSync(data);
            });
        } catch (e) {
            console.error(e);
            return message.reply("⚠️ An error occurred while downloading the music.");
        }
    } else {
        try {
            const data = (await Youtube.GetListByKeyword(keywordSearch, false, 6))?.items ?? [];
            const links = data.map(value => value?.id);
            const thumbnails = await Promise.all(data.map(async (value, index) => {
                const thumbnailUrl = `https://i.ytimg.com/vi/${value?.id}/hqdefault.jpg`;
                const thumbnailPath = `${__dirname}/cache/thumbnail-${Date.now()}-${index + 1}.jpg`;
                const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(thumbnailPath, Buffer.from(response.data, 'binary'));
                return fs.createReadStream(thumbnailPath);
            }));

            const body = `There are ${links.length} results matching your search keyword:\n\n${data.map((value, index) => `❍━━━━━━━━━━━━❍\n${index + 1} - ${value?.title} (${value?.length?.simpleText})\n\n`).join('')}❯ Please reply and select one of the above searches`;

            return message.reply({ attachment: thumbnails, body }, async (error, info) => {
                for (let i = 0; i < thumbnails.length; i++) {
                    fs.unlinkSync(`${__dirname}/cache/thumbnail-${Date.now()}-${i + 1}.jpg`);
                }
                global.client.handleReply.push({
                    type: 'reply',
                    name: config.name,
                    messageID: info.messageID,
                    author: message.senderID,
                    link: links
                });
            });
        } catch (e) {
            console.error(e);
            return message.reply(`⚠️ An error occurred, please try again in a moment!!\n${e}`);
        }
    }
}

export default {
    config,
    onCall,
};

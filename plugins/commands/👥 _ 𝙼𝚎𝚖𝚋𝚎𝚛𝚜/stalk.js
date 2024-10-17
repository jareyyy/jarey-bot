import axios from 'axios';

const config = {
    name: "stalk",
    version: "1.0.0",
    description: "Get info using uid/reply to a message",
    credits: "Mahiro chan",
    cooldown: 2,
};

async function stalk(id, token) {
    try {
        const apiUrl = `https://graph.facebook.com/${id}?fields=id,is_verified,work,hometown,username,link,name,locale,location,about,website,birthday,gender,relationship_status,first_name,subscribers.limit(0)&access_token=${token}`;
        
        const response = await axios.get(apiUrl, {
            headers: {
                'User -Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like) Version/12.0 eWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
                'accept': 'application/json, text/plain, */*'
            }
        });

        const resp = response.data;

        const name = resp.name || 'No data!';
        const linkProfile = resp.link || 'No data!';
        const uid = resp.id || 'No data!';
        const firstName = resp.first_name || 'No data!';
        const username = resp.username || 'No data!';
        const web = resp.website || 'No data!';
        const gender = resp.gender || 'No data!';
        const relationshipStatus = resp.relationship_status || 'No data!';
        const bday = resp.birthday || 'No data!';
        const follower = resp.subscribers?.summary?.total_count || 'No data!';
        const locale = resp.locale || 'No data!';
        const isVerified = resp.is_verified || false;
        const about = resp.about || 'No data!';
        const hometown = resp.hometown?.name || 'No hometown!';
        const livein = resp.location?.name || 'No data!';
        const workplace = resp.work?.map(work => `- ${work.employer.name}`).join('\n') || 'No data!';
        const followers = follower.toLocaleString();
        const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=${token}`;

        const reply = `•——INFORMATION——•
Name: ${name}
First name: ${firstName}
Profile link: ${linkProfile}
Gender: ${gender}
Relationship Status: ${relationshipStatus}
Birthday: ${bday}
Follower(s): ${followers}
Current city: ${livein}
Hometown: ${hometown}
Locale: ${locale}
Workplace: 
${workplace}
•——END——•`;

        return { reply, avatar };
    } catch (error) {
        console.error('Error:', error.message);
        return `❌𝚂𝙾𝚁𝚁𝚈, 𝚆𝙴 𝙰𝚁𝙴 𝙷𝙰𝚅𝙸𝙽𝙶 𝙴𝚁𝚁𝙾𝚁 𝙵𝙴𝚃𝙲𝙷𝙸𝙽𝙶: ${error.message}`;
    }
}

async function onCall({ message, args, threadUser Id }) {
    const token = "EAAAAUaZ...."; // Your access token here
    const inputValue = args.join(" ");

    if (inputValue === "__config__") {
        return message.reply(JSON.stringify(config, null, 2));
    }

    const id = inputValue.trim();
    if (id.startsWith('https://www.facebook.com/') || id.startsWith('https://www.facebook.com/profile.php?id=')) {
        return message.reply('❌𝙴𝙽𝚃𝙴𝚁 𝙸𝙳 𝙾𝙽𝙻𝚈.');
    }

    if (id) {
        const validIds = ['615', '100'];
        if (validIds.some(validId => id.startsWith(validId))) {
            const { reply, avatar } = await stalk(id, token);
            await message.reply(reply);
            await message.reply({ files: [avatar] }); // Assuming the message object can handle file attachments
        } else {
            return message.reply('❌𝙴𝙽𝚃𝙴𝚁 𝚅𝙰𝙻𝙸𝙳 𝙸𝙳 𝙾𝙽𝙻𝚈.');
        }
export default {
    config,
    onCall,
};

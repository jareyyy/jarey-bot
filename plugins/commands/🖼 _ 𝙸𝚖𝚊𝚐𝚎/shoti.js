async function sendVideo(message) {
    const { name, url } = apiConfig;
    const apiUrl = url();

    message.send(`⏱️ | Video is sending please wait.`);

    try {
        const response = await axios.get(apiUrl);
        
        // Log the response to see its structure
        console.log(response.data);

        // Check if the URL exists in the response
        if (!response.data || !response.data.url) {
            throw new Error("URL not found in the API response.");
        }

        const ext = response.data.url.substring(response.data.url.lastIndexOf(".") + 1);
        const videoPath = `${__dirname}/cache/shoti.${ext}`;

        const callback = () => {
            message.send({
                body: `random bebegurl sa tiktok`,
                attachment: fs.createReadStream(videoPath)
            }, () => fs.unlinkSync(videoPath));
        };

        request(response.data.url).pipe(fs.createWriteStream(videoPath)).on("close", callback);
    } catch (error) {
        console.error(`Error fetching video from ${name}:`, error.message || error);
        message.send("API error status: 200");
        
        // Check if setReaction exists before calling it
        if (typeof message.setReaction === 'function') {
            message.setReaction("😢");
        }
    }
}

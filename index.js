
const express = require('express');
const path = require('path');
const { instagramGetUrl } = require('instagram-url-direct');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.post('/download', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Please provide an Instagram URL.' });
    }

    try {

        const result = await instagramGetUrl(url);


        const videoUrls = result.url_list.filter(item => item.includes('.mp4'));

        if (videoUrls.length > 0) {
         
            res.json({ success: true, url: videoUrls[0] });
        } else {
            res.status(404).json({ success: false, error: 'No video found at the provided URL.' });
        }
    } catch (error) {
        console.error('Error downloading Instagram video:', error);
        res.status(500).json({ success: false, error: 'Failed to download video. Please check the URL and try again.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
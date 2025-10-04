const express = require('express');
const path = require('path');
const { getVideoInfo } = require('reelflow'); // Using reelflow

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/V2",(req,res)=>{
  res.sendFile(__dirname+"/public/v2.html")
})
app.get("/V3",(req,res)=>{
  res.sendFile(__dirname+"/public/v2.html")
})
app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'Please provide an Instagram URL.' });
  }

  try {
    const video = await getVideoInfo(url);

    if (video && video.videoUrl) {
      res.json({ success: true, url: video.videoUrl });
    } else {
      res.status(404).json({ success: false, error: 'No video found at the provided URL.' });
    }
  } catch (error) {
    console.error('Error downloading Instagram video:', error.message);
    res.status(500).json({ success: false, error: 'Failed to download video. Please check the URL and try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

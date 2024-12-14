import express from 'express';
import { GetListByKeyword } from 'youtube-search-api';

const router = express.Router();

router.get('/play', async (req, res) => {
    const { query } = req.query;

    console.log('🔍 Received search query:', query);

    if (!query) {
        console.error('❌ Missing query parameter');
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // YouTube Search
        console.log('🔎 Searching YouTube for query...');
        const result = await GetListByKeyword(query, false, 1);
        
        console.log('🎵 Search Result:', JSON.stringify(result, null, 2));

        if (!result.items || result.items.length === 0) {
            console.warn('⚠️ No results found for query');
            return res.status(404).json({ error: 'No results found' });
        }

        const videoId = result.items[0].id;
        const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
        
        console.log('🔗 Generated YouTube Link:', youtubeLink);

        // Parallel fetching of audio download links
        console.log('📦 Fetching audio download links...');
        const [audioResponse, audioUrlDownload] = await Promise.all([
            fetch(`https://api.giftedtech.my.id/api/download/yta?apikey=gifted&url=${youtubeLink}`),
            fetch(`https://bk9.fun/download/ytmp3?url=${youtubeLink}`)
        ]);

        console.log('📡 Audio API Responses:');
        console.log('- GiftedTech API Response Status:', audioResponse.status);
        console.log('- BK9 API Response Status:', audioUrlDownload.status);

        // Validate and parse responses
        if (!audioResponse.ok) {
            console.error('❌ Network response was not ok');
            throw new Error('Network response was not ok');
        }

        const audioData = await audioResponse.json();
        const downloadDataUrl = await audioUrlDownload.json();

        console.log('🎧 Audio Data:', JSON.stringify(audioData, null, 2));
        console.log('⬇️ Download Data:', JSON.stringify(downloadDataUrl, null, 2));

        if (audioData && audioData.success) {
            const responseData = {
                songName: audioData.result.title,
                Image: audioData.result.thumbnail,
                audio_url: downloadDataUrl.BK9.downloadUrl[3],
            };

            console.log('✅ Final Response:', JSON.stringify(responseData, null, 2));
            return res.json(responseData);
        } else {
            console.error('❌ Failed to fetch YouTube audio');
            throw new Error('Failed to fetch YouTube audio');
        }
    } catch (error) {
        console.error('🚨 YouTube API Error:', error);
        res.status(500).json({ error: 'Failed to fetch YouTube audio' });
    }
});

export default router;
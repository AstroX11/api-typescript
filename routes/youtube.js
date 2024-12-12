import express from 'express';
import { GetListByKeyword } from 'youtube-search-api';

const router = express.Router();

router.get('/play', async (req, res) => {
	const { query } = req.query;

	if (!query) {
		return res.status(400).json({ error: 'Query parameter is required' });
	}

	try {
		const result = await GetListByKeyword(query, false, 1);
		if (!result.items || result.items.length === 0) {
			return res.status(404).json({ error: 'No results found' });
		}

		const videoId = result.items[0].id;
		const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
		const audioResponse = await fetch(`https://api.giftedtech.my.id/api/download/yta?apikey=gifted&url=${youtubeLink}`);

		if (!audioResponse.ok) {
			throw new Error('Network response was not ok');
		}

		const audioData = await audioResponse.json();

		if (audioData && audioData.success) {
			return res.json({
				songName: audioData.result.title,
				Image: audioData.result.thumbnail,
				music_url: audioData.result.media[0].download_url,
			});
		} else {
			throw new Error('Failed to fetch YouTube audio');
		}
	} catch (error) {
		console.error('YouTube API Error:', error);
		res.status(500).json({ error: 'Failed to fetch YouTube audio' });
	}
});

export default router;

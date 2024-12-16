import express from 'express';
import { youtubePlay } from '../utils/youtube.js';
const router = express.Router();

router.get('/play', async (req, res) => {
	try {
		const { query } = req;
		const data = await youtubePlay(query);
		res.json(data);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

export default router;

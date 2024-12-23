import express from 'express';
import { AnimeNews } from '../utils/anime.js';

const router = express.Router();

router.get('/animenews', async (req, res) => {
	try {
		const response = await AnimeNews();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router
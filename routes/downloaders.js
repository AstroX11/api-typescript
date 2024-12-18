import express from 'express';
import { savetubemp3, savetubemp4 } from '../utils/youtube.js';
const router = express.Router();

router.get('/ytmp3', async (req, res) => {
	try {
		if (!req.query || !req.query.url) {
			throw new Error("The 'url' parameter is required.");
		}
		const { url } = req.query;
		const data = await savetubemp3(url);
		res.json(data);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/ytmp4', async (req, res) => {
	try {
		if (!req.query || !req.query.url) {
			throw new Error("The 'url' parameter is required.");
		}
		const { url } = req.query;
		const data = await savetubemp4(url);
		res.json(data);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

export default router;

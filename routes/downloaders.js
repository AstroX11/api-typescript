import express from 'express';
import { savetubemp3, savetubemp4 } from '../utils/youtube.js';
import { facebook, instagram, tiktok, twitter } from '../utils/downloader.js';
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
		res.json({ title: data.title, url: data.link, thumbnail: data.thumbnail });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});
router.get('/instagram', async (req, res) => {
	try {
		if (!req.query || !req.query.url) {
			throw new Error("The 'url' parameter is required.");
		}
		const { url } = req.query;
		const data = await instagram(url);
		res.json({ url: data.download_url });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/twitter', async (req, res) => {
	try {
		if (!req.query || !req.query.url) {
			throw new Error("The 'url' parameter is required.");
		}
		const { url } = req.query;
		const data = await twitter(url);
		res.json({ url: data });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/facebook', async (req, res) => {
	try {
		if (!req.query || !req.query.url) {
			throw new Error("The 'url' parameter is required.");
		}
		const { url } = req.query;
		const data = await facebook(url);
		res.json({ url: data.url });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/tiktok', async (req, res) => {
	try {
		if (!req.query || !req.query.url) {
			throw new Error("The 'url' parameter is required.");
		}
		const { url } = req.query;
		const data = await tiktok(url);
		res.json({ title: data.title, url: data.video.noWatermark });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

export default router;

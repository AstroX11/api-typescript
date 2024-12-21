import { Router } from 'express';
import { Google, stickersearch, wallpaper, wikipedia } from '../utils/search.js';

const router = Router();

router.get('/ssticker', async (req, res) => {
	try {
		const { query } = req.query; // Extract 'query' parameter
		if (!query) {
			return res
				.status(400)
				.json({ error: 'Query parameter is required.' });
		}
		const results = await stickersearch(query);
		res.json(results);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/google', async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res
				.status(400)
				.json({ error: 'Query parameter is required.' });
		}
		const response = await Google(query);
		res.json({ result: response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/wallpaper', async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res
				.status(400)
				.json({ error: 'Query parameter is required.' });
		}
		const results = await wallpaper(query);
		res.json(results);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/wikipedia', async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res
				.status(400)
				.json({ error: 'Query parameter is required.' });
		}
		const results = await wikipedia(query);
		res.json(results);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;

import fs from 'fs';
import multer from 'multer';
import os from 'os'
const upload = multer({
	dest: os.tmpdir(),
	fileFilter: (req, file, cb) => {
		if (file.mimetype === 'image/webp') {
			cb(null, true);
		} else {
			cb(new Error('Only WebP files are allowed'));
		}
	}
});

import { Router } from 'express';
import {
	Bing,
	FootballNews,
	ForexAfrica,
	ForexAmericas,
	ForexAsia,
	ForexEurope,
	ForexExotic,
	ForexMajor,
	ForexMiddleEast,
	ForexMinor,
	ForexPacific,
	getAirQualityForecast,
	getMarketData,
	GizChinaNews,
	Google,
	mediafire,
	News,
	stickersearch,
	VoxNews,
	WaBetaInfo,
	wallpaper,
	wikipedia,
	Yahoo
} from '../utils/search.js';
import { convertWebPtoMP4 } from '../utils/tools.js';

const router = Router();

router.get('/ssticker', async (req, res) => {
	try {
		const { query } = req.query; // Extract 'query' parameter
		if (!query) {
			return res.status(400).json({ error: 'Query parameter is required.' });
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
			return res.status(400).json({ error: 'Query parameter is required.' });
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
			return res.status(400).json({ error: 'Query parameter is required.' });
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
			return res.status(400).json({ error: 'Query parameter is required.' });
		}
		const results = await wikipedia(query);
		res.json(results);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/mediafire', async (req, res) => {
	try {
		const { url } = req.query;
		if (!url) {
			return res.status(400).json({ error: 'URL parameter is required.' });
		}
		const results = await mediafire(url);
		res.json(results);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/bing', async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res.status(400).json({ error: 'Query parameter is required.' });
		}
		const response = await Bing(query);
		res.json({ result: response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/technews', async (req, res) => {
	try {
		const response = await GizChinaNews();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/footballnews', async (req, res) => {
	try {
		const response = await FootballNews();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/yahoo', async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res.status(400).json({ error: 'Query parameter is required.' });
		}
		const response = await Yahoo(query);
		res.json({ result: response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/news', async (req, res) => {
	try {
		const data = await News();
		res.json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/voxnews', async (req, res) => {
	try {
		const response = await VoxNews();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/wabeta', async (req, res) => {
	try {
		const response = await WaBetaInfo();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/forex', async (req, res) => {
	try {
		const { symbol } = req.query;
		if (!symbol) {
			return res.status(400).json({ error: 'Symbol parameter is required.' });
		}
		const response = await getMarketData(symbol);
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxmajor', async (req, res) => {
	try {
		const response = await ForexMajor();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxminor', async (req, res) => {
	try {
		const response = await ForexMinor();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxexotic', async (req, res) => {
	try {
		const response = await ForexExotic();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxamericas', async (req, res) => {
	try {
		const response = await ForexAmericas();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxeurope', async (req, res) => {
	try {
		const response = await ForexEurope();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxasia', async (req, res) => {
	try {
		const response = await ForexAsia();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxpacific', async (req, res) => {
	try {
		const response = await ForexPacific();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxmiddle-east', async (req, res) => {
	try {
		const response = await ForexMiddleEast();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/fxafrica', async (req, res) => {
	try {
		const response = await ForexAfrica();
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/airquality', async (req, res) => {
	try {
		const { country, city } = req.query;
		if (!country || !city) {
			return res.status(400).json({
				error: 'Country and city parameters are required.'
			});
		}
		const response = await getAirQualityForecast(country, city);
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/webpmp4', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No file provided' });
		}
		const videoUrl = await convertWebPtoMP4(req.file.path);
		fs.unlink(req.file.path, err => {
			if (err) console.error('Error deleting temporary file:', err);
		});

		return res.json({ url: videoUrl });
	} catch (error) {
		console.error('Conversion error:', error);
		return res.status(500).json({ error: 'Conversion failed' });
	}
});

export default router;

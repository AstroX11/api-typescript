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
	ForexMinor,
	ForexPacific,
	getAirQualityForecast,
	GizChinaNews,
	Google,
	mediafire,
	stickersearch,
	wallpaper,
	wikipedia,
	Yahoo,
} from '../utils/search.js';

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

router.get('/mediafire', async (req, res) => {
	try {
		const { url } = req.query;
		if (!url) {
			return res
				.status(400)
				.json({ error: 'URL parameter is required.' });
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
			return res
				.status(400)
				.json({ error: 'Query parameter is required.' });
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
			return res
				.status(400)
				.json({ error: 'Query parameter is required.' });
		}
		const response = await Yahoo(query);
		res.json({ result: response });
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
			return res
				.status(400)
				.json({
					error: 'Country and city parameters are required.',
				});
		}
		const response = await getAirQualityForecast(country, city);
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;

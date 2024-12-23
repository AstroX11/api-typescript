import express from 'express';
import { addTextToTweet, getAvailableTemplates } from '../utils/meme.js';

const router = express.Router();

router.get('/templates', (req, res) => {
	try {
		const templates = getAvailableTemplates();
		res.json({
			success: true,
			templates,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: 'Failed to fetch templates',
		});
	}
});

router.get('/meme/:template', async (req, res) => {
	try {
		const { template } = req.params;
		const { text } = req.query;

		if (!text) {
			return res.status(400).json({
				success: false,
				error: 'Text parameter is required',
			});
		}

		const templates = getAvailableTemplates();
		if (!templates.includes(template)) {
			return res.status(404).json({
				success: false,
				error: 'Template not found',
				availableTemplates: templates,
			});
		}

		const imageBuffer = await addTextToTweet(text, template);

		res.set('Content-Type', 'image/png');
		res.send(imageBuffer);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: 'Failed to generate image',
		});
	}
});

export default router;

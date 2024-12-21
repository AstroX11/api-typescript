// routes/image.js
import express from 'express';
import { convertWebPToJPGBuffer } from '../utils/convert.js';
import { getBuffer } from 'xstro-utils';
const router = express.Router();

/**
 * API route to convert WebP image to JPG.
 */

router.get('/photo', async (req, res) => {
	try {
		const { url } = req.query;
		if (!imageUrl) {
			return res.status(400).send('No image URL provided.');
		}
		const webpBuffer = await getBuffer(url);
		const jpgBuffer = await convertWebPToJPGBuffer(webpBuffer);

		res.set('Content-Type', 'image/jpeg');
		res.send(jpgBuffer);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).send('Error converting image.');
	}
});

export default router;

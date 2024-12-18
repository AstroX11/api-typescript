// routes/image.js
import express from 'express';
import { convertWebPToJPGBuffer } from '../utils/convert.js';
const router = express.Router();

/**
 * API route to convert WebP image to JPG.
 */
router.post('/photo', async (req, res) => {
	try {
		if (!req.files || !req.files.image) {
			return res.status(400).send('No image file uploaded.');
		}

		const webpBuffer = req.files.image.data;
        console.log(webpBuffer)
		const jpgBuffer = await convertWebPToJPGBuffer(webpBuffer);

		res.set('Content-Type', 'image/jpeg');
		res.send(jpgBuffer);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).send('Error converting image.');
	}
});

export default router;

import express from 'express';
import multer from 'multer';
import { flipMedia } from './flipmedia.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/hello', (req, res) => {
	res.json({ message: 'Running' });
});

router.post('/flip', upload.single('media'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}
		const { direction } = req.query;
		if (!direction) {
			return res.status(400).json({ error: 'Direction query parameter is required' });
		}
		const flippedMedia = await flipMedia(req.file.buffer, direction);
		res.setHeader('Content-Type', req.file.mimetype);
		res.send(flippedMedia);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

export default router;

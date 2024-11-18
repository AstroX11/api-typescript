import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { flipMedia } from './flipmedia.js';
import { audioToBlackVideo } from './blackVideo.js';
import { addTextToTweet } from './faketweet.js';

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

router.post('/blackvideo', upload.single('audio'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });
		const videoBuffer = await audioToBlackVideo(req.file.buffer);
		res.setHeader('Content-Type', 'video/mp4');
		res.send(videoBuffer);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to convert audio to video' });
	}
});

const generateImage = async (text, name) => {
	const validNames = ['andrew', 'elonmusk', 'messi', 'obama', 'ronaldo', 'trump'];
	if (!validNames.includes(name)) throw new Error('Invalid image name');
	const imagePath = join('./media', `${name}.png`);
	if (!fs.existsSync(imagePath)) throw new Error('Image file not found');
	return await addTextToTweet(text, imagePath);
};

router.post('/meme', async (req, res) => {
	try {
		const { text, name } = req.body;
		if (!text || !name) return res.status(400).json({ error: 'Text and name are required' });
		const imageBuffer = await generateImage(text, name.toLowerCase());
		res.setHeader('Content-Type', 'image/png');
		return res.send(imageBuffer);
	} catch (error) {
		return res.status(400).json({
			error: error.message || 'Error generating image',
		});
	}
});

export default router;

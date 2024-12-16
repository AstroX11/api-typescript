import express from 'express';
import multer from 'multer';
import { audioToBlackVideo, audioToOpus, flipMedia } from '../utils/ffmpeg';
import { toSticker } from '../utils/sticker';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/flip', upload.single('media'), async (req, res) => {
	try {
		const { direction } = req.query;
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

router.post('/sticker', upload.single('media'), async (req, res) => {
	try {
		const { packname = 'Xstro', author = 'Astro' } = req.body;
		if (!req.file) return res.status(400).json({ error: 'No media file uploaded' });
		const stickerBuffer = await toSticker(req.file.buffer, packname, author);
		res.setHeader('Content-Type', 'image/webp');
		res.send(stickerBuffer);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

router.post('/opus', upload.single('audio'), async (req, res) => {
	try {
		const opusBuffer = await audioToOpus(req.file.buffer);
		res.setHeader('Content-Type', 'audio/ogg');
		res.setHeader('Content-Disposition', 'attachment; filename="converted.ogg"');
		res.send(opusBuffer);
	} catch (error) {
		console.error('Conversion error:', error);
		res.status(500).json({ error: 'Failed to convert audio to Opus format' });
	}
});

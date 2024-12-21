import express from 'express';
import { audioToBlackVideo, audioToMp3, flipMedia } from '../utils/ffmpeg.js';
import { toSticker } from '../utils/sticker.js';
import { getBuffer } from 'xstro-utils';

const router = express.Router();

router.get('/flip', async (req, res) => {
	try {
		const { url, direction } = req.query;
		if (!url) return res.status(400).json({ error: 'URL is required' });

		const mediaBuffer = await getBuffer(url);
		const flippedMedia = await flipMedia(mediaBuffer, direction);

		const contentType = url.endsWith('.mp4')
			? 'video/mp4'
			: url.endsWith('.jpg') || url.endsWith('.jpeg')
			? 'image/jpeg'
			: url.endsWith('.png')
			? 'image/png'
			: 'application/octet-stream';

		res.setHeader('Content-Type', contentType);
		res.send(flippedMedia);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

router.get('/blackvideo', async (req, res) => {
	try {
		const { url } = req.query;
		if (!url)
			return res.status(400).json({ error: 'Audio URL is required' });

		const audioBuffer = await getBuffer(url);
		const videoBuffer = await audioToBlackVideo(audioBuffer);

		res.setHeader('Content-Type', 'video/mp4');
		res.send(videoBuffer);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to convert audio to video' });
	}
});

router.get('/sticker', async (req, res) => {
	try {
		const { url, packname = 'Xstro', author = 'Astro' } = req.query;
		if (!url)
			return res.status(400).json({ error: 'Media URL is required' });

		const mediaBuffer = await getBuffer(url);
		const stickerBuffer = await toSticker(mediaBuffer, packname, author);

		res.setHeader('Content-Type', 'image/webp');
		res.send(stickerBuffer);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

router.get('/mp3', async (req, res) => {
	try {
		const { url } = req.query;
		if (!url)
			return res.status(400).json({ error: 'Audio URL is required' });

		const audioBuffer = await getBuffer(url);
		const mp3Buffer = await audioToMp3(audioBuffer);

		res.setHeader('Content-Type', 'audio/mpeg');
		res.setHeader(
			'Content-Disposition',
			'attachment; filename="audio.mp3"',
		);
		res.send(mp3Buffer);
	} catch (error) {
		console.error('Conversion error:', error);
		res.status(500).json({
			error: 'Failed to convert audio to MP3 format',
		});
	}
});

export default router;

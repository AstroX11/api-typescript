import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { tmpdir } from 'os';
import { join } from 'path';
import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Converts audio buffer to WhatsApp-compatible Opus format
 * @param {Buffer} inputBuffer - Audio buffer to convert
 * @returns {Promise<string>} Path to converted file
 */
async function convertToWhatsAppOpus(inputBuffer) {
	const tempInput = join(tmpdir(), `${randomBytes(16).toString('hex')}.tmp`);
	const tempOutput = join(tmpdir(), `${randomBytes(16).toString('hex')}.ogg`);

	try {
		// Write buffer to temporary file
		await fs.writeFile(tempInput, inputBuffer);

		// Convert to opus
		await new Promise((resolve, reject) => {
			ffmpeg(tempInput)
				.toFormat('opus')
				.audioCodec('libopus')
				.audioChannels(1) // Mono
				.audioFrequency(16000) // 16kHz sample rate
				.outputOptions([
					'-b:a 24k', // Bitrate
					'-vbr on', // Variable bitrate
					'-compression_level 10', // Maximum compression
				])
				.on('error', reject)
				.on('end', resolve)
				.save(tempOutput);
		});

		// Read the converted file
		const convertedBuffer = await fs.readFile(tempOutput);

		// Clean up temp files
		await Promise.all([fs.unlink(tempInput).catch(() => {}), fs.unlink(tempOutput).catch(() => {})]);

		return convertedBuffer;
	} catch (error) {
		// Clean up temp files on error
		await Promise.all([fs.unlink(tempInput).catch(() => {}), fs.unlink(tempOutput).catch(() => {})]);
		throw error;
	}
}

const router = express.Router();

router.post('/convert-to-opus', upload.single('audio'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No audio file uploaded' });
		}

		const mimeType = req.file.mimetype;
		if (!mimeType.startsWith('audio/')) {
			return res.status(400).json({ error: 'Uploaded file must be an audio file' });
		}

		const opusBuffer = await convertToWhatsAppOpus(req.file.buffer);

		res.setHeader('Content-Type', 'audio/ogg');
		res.setHeader('Content-Disposition', 'attachment; filename="converted.ogg"');
		res.send(opusBuffer);
	} catch (error) {
		console.error('Conversion error:', error);
		res.status(500).json({ error: 'Failed to convert audio to Opus format' });
	}
});

export default router;

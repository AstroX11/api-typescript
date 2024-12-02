import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { fileTypeFromBuffer } from 'file-type';
import { Sticker } from 'wa-sticker-formatter';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir);
}

/**
 * Converts an image to a WebP sticker.
 *
 * @param {Buffer} media - Image buffer.
 * @param {string} pack - Sticker pack name.
 * @param {string} author - Sticker author name.
 * @returns {Promise<Buffer>} - Sticker WebP buffer.
 */
const img2webp = async (media, pack, author) => {
	const tmpFileIn = path.join(tempDir, `${Date.now()}.jpg`);
	fs.writeFileSync(tmpFileIn, media);

	const sticker = new Sticker(tmpFileIn, { crop: true, keepScale: true, pack, author });
	const webpBuffer = await sticker.toBuffer();

	fs.unlinkSync(tmpFileIn);
	return webpBuffer;
};

/**
 * Converts a video to an optimized animated WebP sticker.
 *
 * @param {Buffer} media - Video buffer.
 * @returns {Promise<Buffer>} - Sticker WebP buffer.
 */
const mp42webp = async media => {
	const tmpFileIn = path.join(tempDir, `${Date.now()}.mp4`);
	const tmpFileOut = path.join(tempDir, `${Date.now()}.webp`);

	fs.writeFileSync(tmpFileIn, media);

	await new Promise((resolve, reject) => {
		ffmpeg(tmpFileIn)
			.outputOptions([
				`-t 8`, // Limit the video to 8 seconds
				`-vf fps=15,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0`,
				'-loop 0', // Infinite looping for animated stickers
				'-pix_fmt yuva420p',
			])
			.toFormat('webp')
			.on('end', resolve)
			.on('error', reject)
			.save(tmpFileOut);
	});

	const webpBuffer = fs.readFileSync(tmpFileOut);

	fs.unlinkSync(tmpFileIn);
	fs.unlinkSync(tmpFileOut);

	return webpBuffer;
};

/**
 * Converts media to a WhatsApp-compatible sticker.
 *
 * @param {Buffer} buffer - Media buffer (image or video).
 * @param {string} pack - Sticker pack name.
 * @param {string} author - Sticker author name.
 * @returns {Promise<Buffer>} - Sticker WebP buffer.
 */
export const toSticker = async (buffer, pack, author) => {
	const fileType = await fileTypeFromBuffer(buffer);
	const { mime } = fileType;

	let stickerBuffer;
	console.log('Detected MIME Type:', mime);

	if (mime.startsWith('image/')) {
		stickerBuffer = await img2webp(buffer, pack, author);
	} else if (mime.startsWith('video/')) {
		stickerBuffer = await mp42webp(buffer); // Direct WebP conversion for videos
	} else {
		throw new Error('Only images and videos are supported');
	}

	return stickerBuffer;
};

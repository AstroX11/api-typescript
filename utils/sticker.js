import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { fileTypeFromBuffer } from 'file-type';
import { Sticker } from 'wa-sticker-formatter';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Converts an image to a WebP sticker.
 *
 * @param {Buffer} media - Image buffer.
 * @param {string} pack - Sticker pack name.
 * @param {string} author - Sticker author name.
 * @returns {Promise<Buffer>} - Sticker WebP buffer.
 */
export const img2webp = async (media, pack, author) => {
	const webpBuffer = await sharp(media)
		.resize({
			width: 512,
			height: 512,
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.webp({ quality: 80 })
		.toBuffer();

	const sticker = new Sticker(webpBuffer, {
		pack,
		author,
		crop: false,
	});
	return await sticker.toBuffer();
};

/**
 * Converts a video to an optimized animated WebP sticker.
 *
 * @param {Buffer} media - Video buffer.
 * @returns {Promise<Buffer>} - Sticker WebP buffer.
 */
export const mp42webp = async media => {
	const tmpFileIn = path.join(`${Date.now()}.mp4`);
	const tmpFileOut = path.join(`${Date.now()}.webp`);
	fs.writeFileSync(tmpFileIn, media);
	await new Promise((resolve, reject) => {
		ffmpeg(tmpFileIn).outputOptions([`-t 8`, `-vf fps=15,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0`, '-loop 0', '-pix_fmt yuva420p']).toFormat('webp').on('end', resolve).on('error', reject).save(tmpFileOut);
	});
	const buffer = fs.readFileSync(tmpFileOut);
	fs.unlinkSync(tmpFileIn);
	fs.unlinkSync(tmpFileOut);
	return buffer;
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
	let res;
	if (mime.startsWith('image/')) {
		res = await img2webp(buffer, pack, author);
	} else if (mime.startsWith('video/')) {
		res = await mp42webp(buffer);
	} else {
		throw new Error('Only images and videos are supported');
	}
	return res;
};

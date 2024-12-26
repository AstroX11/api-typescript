import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { fileTypeFromBuffer } from 'file-type';
import { Sticker } from 'wa-sticker-formatter';
import { pipeline } from 'stream/promises';
import { Readable, Writable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Memory-optimized image to WebP conversion
 */
export const img2webp = async (media, pack, author) => {
	// Configure sharp to use less memory
	sharp.cache(false);
	sharp.concurrency(1);

	// Process image in streaming fashion
	const transformer = sharp()
		.resize({
			width: 512,
			height: 512,
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.webp({
			quality: 80,
			lossless: false,
			force: true,
		});

	// Create readable stream from buffer
	const readableStream = new Readable();
	readableStream.push(media);
	readableStream.push(null);

	// Process in chunks
	const chunks = [];
	await pipeline(
		readableStream,
		transformer,
		new Writable({
			write(chunk, encoding, callback) {
				chunks.push(chunk);
				callback();
			},
		}),
	);

	const webpBuffer = Buffer.concat(chunks);

	// Create sticker with optimized settings
	const sticker = new Sticker(webpBuffer, {
		pack,
		author,
		crop: false,
		quality: 80,
	});

	return await sticker.toBuffer();
};

/**
 * Memory-optimized video to WebP conversion
 */
export const mp42webp = async media => {
	const tmpDir = path.join(process.env.TMPDIR || '/tmp');
	const tmpFileIn = path.join(tmpDir, `${Date.now()}.mp4`);
	const tmpFileOut = path.join(tmpDir, `${Date.now()}.webp`);

	// Write input file in chunks
	await fs.promises.writeFile(tmpFileIn, media);

	try {
		await new Promise((resolve, reject) => {
			ffmpeg(tmpFileIn)
				.outputOptions([
					'-t 8',
					'-vf',
					[
						'fps=10', // Reduced from 15 to 10
						'scale=384:384:force_original_aspect_ratio=decrease', // Reduced from 512x512
						'pad=384:384:(ow-iw)/2:(oh-ih)/2:color=black@0',
					].join(','),
					'-loop',
					'0',
					'-preset',
					'ultrafast', // Use fastest encoding
					'-pix_fmt',
					'yuva420p',
					'-threads',
					'1', // Limit threads
				])
				.toFormat('webp')
				.on('end', resolve)
				.on('error', reject)
				.save(tmpFileOut);
		});

		// Read output file in chunks
		const buffer = await fs.promises.readFile(tmpFileOut);
		return buffer;
	} finally {
		// Clean up temporary files
		await Promise.all([
			fs.promises.unlink(tmpFileIn).catch(() => {}),
			fs.promises.unlink(tmpFileOut).catch(() => {}),
		]);
	}
};

/**
 * Main sticker conversion function with memory optimization
 */
export const toSticker = async (buffer, pack, author) => {
	// Add memory usage logging for debugging
	const memoryUsage = process.memoryUsage();
	console.log('Memory usage before processing:', {
		heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
		heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
	});

	try {
		const fileType = await fileTypeFromBuffer(buffer);
		const { mime } = fileType;

		// Add size check
		if (buffer.length > 10 * 1024 * 1024) {
			// 10MB limit
			throw new Error('File too large. Maximum size is 10MB');
		}

		let res;
		if (mime.startsWith('image/')) {
			res = await img2webp(buffer, pack, author);
		} else if (mime.startsWith('video/')) {
			res = await mp42webp(buffer);
		} else {
			throw new Error('Only images and videos are supported');
		}

		return res;
	} finally {
		// Force garbage collection if available
		if (global.gc) {
			global.gc();
		}

		// Log memory usage after processing
		const endMemoryUsage = process.memoryUsage();
		console.log('Memory usage after processing:', {
			heapUsed: `${Math.round(
				endMemoryUsage.heapUsed / 1024 / 1024,
			)}MB`,
			heapTotal: `${Math.round(
				endMemoryUsage.heapTotal / 1024 / 1024,
			)}MB`,
		});
	}
};

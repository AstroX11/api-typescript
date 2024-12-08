import { randomInt } from 'crypto';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import PDFDocument from 'pdfkit';
import waStickerFormatter from 'wa-sticker-formatter';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

export async function textToPdf(text) {
	const tempFilePath = join(tmpdir(), `output_${Date.now()}.pdf`);
	const doc = new PDFDocument();

	return new Promise((resolve, reject) => {
		const stream = createWriteStream(tempFilePath); // Use `createWriteStream` with ES modules
		doc.pipe(stream); // Pipe the PDF content to the writable stream
		doc.text(text); // Add text content to the PDF
		doc.end(); // Finalize the PDF document

		stream.on('finish', () => resolve(tempFilePath)); // Resolve with the file path on success
		stream.on('error', reject); // Reject with an error if stream fails
	});
}

// Function 2: Extract Random Frame from Video
export const toImage = async (videoBuffer, outputFilePath) => {
	const filePath = outputFilePath || join(tmpdir(), `frame-${Date.now()}.png`);
	const tempVideoPath = join(tmpdir(), `temp-video-${Date.now()}.mp4`);

	await fs.writeFile(tempVideoPath, videoBuffer);

	return new Promise((resolve, reject) => {
		ffmpeg(tempVideoPath)
			.screenshots({
				timestamps: [`${randomInt(0, 100)}%`],
				filename: filePath,
				folder: tmpdir(),
				size: '640x480',
			})
			.on('end', async () => {
				await fs.unlink(tempVideoPath);
				resolve(filePath);
			})
			.on('error', async err => {
				await fs.unlink(tempVideoPath);
				reject(err);
			});
	});
};

// Functions 3-6: Text to Animated Stickers (attp to attp3)
const createAttpSticker = async (text, animationType) => {
	const sticker = new waStickerFormatter.StickerGenerator();
	sticker.setText(text);
	sticker.setAnimation(animationType); // Replace with appropriate animation logic
	const stickerBuffer = await sticker.toBuffer();
	return stickerBuffer;
};

export const attp = text => createAttpSticker(text, 'type1');
export const attp2 = text => createAttpSticker(text, 'type2');
export const attp3 = text => createAttpSticker(text, 'type3');
export const attp4 = text => createAttpSticker(text, 'type4');

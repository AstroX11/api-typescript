import fs from 'fs';
import path from 'path';
import { Sticker } from 'wa-sticker-formatter';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { fileTypeFromBuffer } from 'file-type';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir);
}

const imageToWebp = async (media, pack, author) => {
	const tmpFileIn = path.join(tempDir, `${Date.now()}.jpg`);
	fs.writeFileSync(tmpFileIn, media);

	const sticker = new Sticker(tmpFileIn, { crop: true, keepScale: true, pack, author });
	const webpBuffer = await sticker.toBuffer();

	fs.unlinkSync(tmpFileIn);
	return webpBuffer;
};

const videoToWebp = async (media, pack, author) => {
	const tmpFileIn = path.join(tempDir, `${Date.now()}.mp4`);
	const tmpFileOut = path.join(tempDir, `${Date.now()}.webp`);

	fs.writeFileSync(tmpFileIn, media);

	await new Promise((resolve, reject) => {
		ffmpeg(tmpFileIn).on('error', reject).on('end', resolve).addOutputOptions(['-vcodec', 'libwebp', '-vf', 'fps=10,scale=120:-1:flags=lanczos', '-loop', '0', '-quality', '70', '-compression_level', '10', '-an', '-maxrate', '200k', '-bufsize', '200k', '-t', '5']).toFormat('webp').save(tmpFileOut);
	});

	const sticker = new Sticker(tmpFileOut, { crop: true, keepScale: true, pack, author });
	const webpBuffer = await sticker.toBuffer();

	fs.unlinkSync(tmpFileIn);
	fs.unlinkSync(tmpFileOut);

	return webpBuffer;
};

export const toSticker = async (buffer, pack, author) => {
	const fileType = await fileTypeFromBuffer(buffer);
	const { mime } = fileType;

	let stickerBuffer;
	console.log(mime);
	if (mime.startsWith('image/')) {
		stickerBuffer = await imageToWebp(buffer, pack, author);
		console.log(stickerBuffer);
	} else if (mime.startsWith('video/')) {
		stickerBuffer = await videoToWebp(buffer, pack, author);
	} else {
		throw new Error('Only images and videos are supported');
	}
	return stickerBuffer;
};

import { imageToWebp, videoToWebp, writeExifWebp } from './stickermaker.js'; 
import { fileTypeFromBuffer } from 'file-type';

export const toSticker = async (buffer, packname = 'XstroMD', author = 'Astro') => {
	const fileType = await fileTypeFromBuffer(buffer);

	if (!fileType) {
		throw new Error('Unsupported file type');
	}

	const { mime } = fileType;
	const metadata = { packname, author };

	let webpBuffer;

	if (mime.startsWith('image/')) {
		webpBuffer = await imageToWebp(buffer);
	} else if (mime.startsWith('video/')) {
		webpBuffer = await videoToWebp(buffer);
	} else {
		throw new Error('Unsupported media type. Only images and videos are allowed.');
	}

	const stickerBuffer = await writeExifWebp(webpBuffer, metadata);
	return stickerBuffer;
};

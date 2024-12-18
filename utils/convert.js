import sharp from 'sharp';

/**
 * Converts a WebP image buffer to a JPG buffer.
 * @param {Buffer} webpBuffer - The buffer of the WebP image.
 * @returns {Promise<Buffer>} - A promise that resolves with the JPG buffer.
 */
export const convertWebPToJPGBuffer = async webpBuffer => {
	const jpgBuffer = await sharp(webpBuffer)
		.jpeg() // Convert to JPG
		.toBuffer(); // Convert to buffer and return it
	return jpgBuffer;
};

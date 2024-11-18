import { createCanvas, loadImage } from 'canvas';

const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
	const words = text.split(' ');
	let line = '';

	words.forEach((word, index) => {
		const testLine = `${line}${word} `;
		const metrics = context.measureText(testLine);
		const testWidth = metrics.width;

		if (testWidth > maxWidth && index > 0) {
			context.fillText(line, x, y);
			line = `${word} `;
			y += lineHeight;
		} else {
			line = testLine;
		}
	});

	context.fillText(line, x, y);
};

export const addTextToTweet = async (text, pathOrBuffer) => {
	const canvas = createCanvas(825, 462);
	const ctx = canvas.getContext('2d');

	const image = typeof pathOrBuffer === 'string' ? await loadImage(pathOrBuffer) : await loadImage(pathOrBuffer);

	ctx.drawImage(image, 0, 0);

	ctx.font = '20px Sans-Serif';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';

	const config = {
		lineHeight: 30,
		maxWidth: 780,
		textX: 20,
		textY: 140,
	};

	wrapText(ctx, text, config.textX, config.textY, config.maxWidth, config.lineHeight);

	return canvas.toBuffer('image/png');
};

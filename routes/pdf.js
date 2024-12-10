import { createWriteStream } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import PDFDocument from 'pdfkit';
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

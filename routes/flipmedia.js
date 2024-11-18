import { writeFileSync, unlinkSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fileTypeFromBuffer } from 'file-type';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

export async function flipMedia(inputBuffer, direction) {
	return new Promise(async (resolve, reject) => {
		const validDirections = ['left', 'right', 'vertical', 'horizontal'];
		if (!validDirections.includes(direction.toLowerCase())) {
			return reject(new Error('Invalid direction. Use: left, right, vertical, or horizontal'));
		}

		const type = await fileTypeFromBuffer(inputBuffer);
		if (!type || !['image', 'video'].includes(type.mime.split('/')[0])) {
			return reject(new Error('Invalid input: must be an image or video file.'));
		}

		const inputPath = join(tmpdir(), `input-${Date.now()}.${type.ext}`);
		const outputPath = join(tmpdir(), `output-${Date.now()}.${type.ext}`);

		writeFileSync(inputPath, inputBuffer);

		let command = ffmpeg(inputPath);
		switch (direction.toLowerCase()) {
			case 'left':
				command = command.videoFilters(type.mime.startsWith('video') ? 'transpose=2' : 'transpose=2');
				break;
			case 'right':
				command = command.videoFilters(type.mime.startsWith('video') ? 'transpose=1' : 'transpose=1');
				break;
			case 'vertical':
				command = command.videoFilters(type.mime.startsWith('video') ? 'vflip' : 'vflip');
				break;
			case 'horizontal':
				command = command.videoFilters(type.mime.startsWith('video') ? 'hflip' : 'hflip');
				break;
		}

		command
			.on('error', err => {
				unlinkSync(inputPath);
				if (existsSync(outputPath)) unlinkSync(outputPath);
				reject(new Error(`FFmpeg error: ${err.message}`));
			})
			.on('end', () => {
				const outputBuffer = readFileSync(outputPath);
				unlinkSync(inputPath);
				unlinkSync(outputPath);
				resolve(outputBuffer);
			})
			.save(outputPath);
	});
}

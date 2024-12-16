import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileTypeFromBuffer } from 'file-type';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';

const { writeFileSync, unlinkSync, existsSync, readFileSync, mkdirSync } = fs;
ffmpeg.setFfmpegPath(ffmpegPath);

const tempDir = path.join(os.tmpdir(), 'media-temp');
if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true });

function createTempPath(ext) {
	return path.join(tempDir, `${Date.now()}.${ext}`);
}

function cleanUp(paths = []) {
	paths.forEach(file => existsSync(file) && unlinkSync(file));
}

async function audioToBlackVideo(input, options = {}) {
	const { width = 1920, height = 1080, backgroundColor = 'black', fps = 30 } = options;

	const audioInputPath = createTempPath('mp3');
	const videoOutputPath = createTempPath('mp4');
	const inputPath = input instanceof Buffer ? (writeFileSync(audioInputPath, input), audioInputPath) : input;

	return new Promise((resolve, reject) => {
		ffmpeg()
			.input(`color=${backgroundColor}:s=${width}x${height}:r=${fps}`)
			.inputOptions(['-f', 'lavfi'])
			.input(inputPath)
			.outputOptions(['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-c:a', 'aac', '-b:a', '128k', '-map', '0:v', '-map', '1:a', '-shortest'])
			.output(videoOutputPath)
			.on('end', () => {
				const videoBuffer = readFileSync(videoOutputPath);
				cleanUp([audioInputPath, videoOutputPath]);
				resolve(videoBuffer);
			})
			.on('error', err => {
				cleanUp([audioInputPath, videoOutputPath]);
				reject(err);
			})
			.run();
	});
}

async function flipMedia(inputBuffer, direction) {
	const validDirections = ['left', 'right', 'vertical', 'horizontal'];
	if (!validDirections.includes(direction.toLowerCase())) {
		throw new Error('Invalid direction. Use: left, right, vertical, or horizontal');
	}

	const type = await fileTypeFromBuffer(inputBuffer);
	if (!type || !['image', 'video'].includes(type.mime.split('/')[0])) {
		throw new Error('Invalid input: must be an image or video file.');
	}

	const inputPath = createTempPath(type.ext);
	const outputPath = createTempPath(type.ext);

	writeFileSync(inputPath, inputBuffer);

	let command = ffmpeg(inputPath);
	if (direction.toLowerCase() === 'left') {
		command = command.videoFilters('transpose=2');
	} else if (direction.toLowerCase() === 'right') {
		command = command.videoFilters('transpose=1');
	} else if (direction.toLowerCase() === 'vertical') {
		command = command.videoFilters('vflip');
	} else if (direction.toLowerCase() === 'horizontal') {
		command = command.videoFilters('hflip');
	}

	return new Promise((resolve, reject) => {
		command
			.on('end', () => {
				const outputBuffer = readFileSync(outputPath);
				cleanUp([inputPath, outputPath]);
				resolve(outputBuffer);
			})
			.on('error', err => {
				cleanUp([inputPath, outputPath]);
				reject(new Error(`FFmpeg error: ${err.message}`));
			})
			.save(outputPath);
	});
}

async function convertToWhatsAppOpus(inputBuffer) {
	const inputPath = createTempPath('tmp');
	const outputPath = createTempPath('ogg');

	writeFileSync(inputPath, inputBuffer);

	await new Promise((resolve, reject) => {
		ffmpeg(inputPath).toFormat('opus').audioCodec('libopus').audioChannels(1).audioFrequency(16000).outputOptions(['-b:a 24k', '-vbr on', '-compression_level 10']).on('error', reject).on('end', resolve).save(outputPath);
	});

	const convertedBuffer = readFileSync(outputPath);
	cleanUp([inputPath, outputPath]);
	return convertedBuffer;
}

export { audioToBlackVideo, flipMedia, convertToWhatsAppOpus };

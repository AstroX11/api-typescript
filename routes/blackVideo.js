import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

export async function audioToBlackVideo(input, options = {}) {
	const { width = 1920, height = 1080, backgroundColor = 'black', fps = 30 } = options;

	const tempDir = path.join('temp');
	if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

	const timestamp = Date.now();
	const audioInputPath = path.join(tempDir, `input_${timestamp}.mp3`);
	const videoOutputPath = path.join(tempDir, `output_${timestamp}.mp4`);

	const inputPath = input instanceof Buffer ? (fs.writeFileSync(audioInputPath, input), audioInputPath) : input;

	return new Promise((resolve, reject) => {
		ffmpeg()
			.input(`color=${backgroundColor}:s=${width}x${height}:r=${fps}`)
			.inputOptions(['-f', 'lavfi'])
			.input(inputPath)
			.outputOptions([
				'-c:v',
				'libx264',
				'-preset',
				'ultrafast',
				'-crf',
				'23',
				'-c:a',
				'aac',
				'-b:a',
				'128k',
				'-map',
				'0:v', // map the video stream
				'-map',
				'1:a', // map the audio stream
				'-shortest', // stop at the shortest stream
			])
			.output(videoOutputPath)
			.on('end', () => {
				const videoBuffer = fs.readFileSync(videoOutputPath);
				if (input instanceof Buffer) fs.unlinkSync(audioInputPath);
				fs.unlinkSync(videoOutputPath);
				resolve(videoBuffer);
			})
			.on('error', err => {
				if (input instanceof Buffer && fs.existsSync(audioInputPath)) fs.unlinkSync(audioInputPath);
				if (fs.existsSync(videoOutputPath)) fs.unlinkSync(videoOutputPath);
				reject(err);
			})
			.run();
	});
}

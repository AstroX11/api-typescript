import axios from 'axios';

const SaveTube = {
	qualities: {
		audio: { 1: '32', 2: '64', 3: '128', 4: '192' },
		video: { 1: '144', 2: '240', 3: '360', 4: '480', 5: '720', 6: '1080', 7: '1440', 8: '2160' },
	},

	headers: {
		accept: '*/*',
		referer: 'https://ytshorts.savetube.me/',
		origin: 'https://ytshorts.savetube.me/',
		'user-agent': 'Postify/1.0.0',
		'Content-Type': 'application/json',
	},

	cdn() {
		return Math.floor(Math.random() * 11) + 51;
	},

	checkQuality(type, qualityIndex) {
		if (!(qualityIndex in this.qualities[type])) {
			throw new Error(`❌ Kualitas ${type} tidak valid. Pilih salah satu: ${Object.keys(this.qualities[type]).join(', ')}`);
		}
	},

	async fetchData(url, cdn, body = {}) {
		const headers = {
			...this.headers,
			authority: `cdn${cdn}.savetube.su`,
		};

		try {
			const response = await axios.post(url, body, { headers });
			return response.data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	dLink(cdnUrl, type, quality, videoKey) {
		return `https://${cdnUrl}/download`;
	},

	async dl(link, qualityIndex, typeIndex) {
		const type = typeIndex === 1 ? 'audio' : 'video';
		const quality = SaveTube.qualities[type][qualityIndex];
		if (!type) throw new Error('❌ Tipe tidak valid. Pilih 1 untuk audio atau 2 untuk video.');
		SaveTube.checkQuality(type, qualityIndex);
		const cdnNumber = SaveTube.cdn();
		const cdnUrl = `cdn${cdnNumber}.savetube.su`;

		const videoInfo = await SaveTube.fetchData(`https://${cdnUrl}/info`, cdnNumber, { url: link });
		const badi = {
			downloadType: type,
			quality: quality,
			key: videoInfo.data.key,
		};

		const dlRes = await SaveTube.fetchData(SaveTube.dLink(cdnUrl, type, quality, videoInfo.data.key), cdnNumber, badi);

		return {
			link: dlRes.data.downloadUrl,
			duration: videoInfo.data.duration,
			durationLabel: videoInfo.data.durationLabel,
			fromCache: videoInfo.data.fromCache,
			id: videoInfo.data.id,
			key: videoInfo.data.key,
			thumbnail: videoInfo.data.thumbnail,
			thumbnail_formats: videoInfo.data.thumbnail_formats,
			title: videoInfo.data.title,
			titleSlug: videoInfo.data.titleSlug,
			videoUrl: videoInfo.data.url,
			quality,
			type,
		};
	},

	async mp3(link) {
		return SaveTube.dl(link, 3, 1); // Default to 128 kbps audio
	},

	async mp4(link) {
		return SaveTube.dl(link, 5, 2); // Default to 720p video
	},
};

export async function savetubemp3(url) {
	return SaveTube.mp3(url);
}

export async function savetubemp4(url) {
	return SaveTube.mp4(url);
}
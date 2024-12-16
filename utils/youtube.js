import { getJson } from 'xstro-utils';
import { GetListByKeyword } from 'youtube-search-api';

function getRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

async function getYoutubeLinkFromSearchParameters(keyword, maxResults = 10) {
	let videoLink = '';

	while (!videoLink) {
		const response = await GetListByKeyword(keyword, false, maxResults);

		if (response && response.items) {
			const video = response.items.find(item => item.type === 'video');

			if (video) {
				videoLink = `https://www.youtube.com/watch?v=${video.id}`;
				return videoLink;
			}
		}
	}
}

async function getYoutubeAudioFromApi(url) {
	const res = await getJson(`https://bk9.fun/download/ytmp3?url=${url}`);
	const { title, downloadUrl } = getRandom(res.BK9.downloadUrl);
	return { title, downloadUrl };
}

export async function youtubePlay(search) {
	if (search === typeof 'string') throw new Error('Your Search Must Be String!');
	const res = await getYoutubeLinkFromSearchParameters(search);
	const data = await getYoutubeAudioFromApi(res);
	return data;
}

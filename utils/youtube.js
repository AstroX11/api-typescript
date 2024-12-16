import ytsr from 'ytsr';
import { getJson } from 'xstro-utils';

function getRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

const getYoutubeLinkFromSearchParameters = async (searchQuery, maxResults = 1) => {
	const searchResults = await ytsr(searchQuery, { limit: maxResults });
	return searchResults.items.length > 0 ? searchResults.items[0].url : null;
};

async function getYoutubeAudioFromApi(url) {
	const res = await getJson(`https://bk9.fun/download/ytmp3?url=${url}`);
	const { title, downloadUrl } = getRandom(res.BK9.downloadUrl);
	return { title, downloadUrl };
}

export async function youtubePlay(search) {
	const res = await getYoutubeLinkFromSearchParameters(search.toString());
	const data = await getYoutubeAudioFromApi(res);
	return data;
}

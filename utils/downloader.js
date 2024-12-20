import axios from 'axios';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { getRandom } from './misc.js';

async function instagram(urls, type) {
	const url = 'https://indownloader.app/request';
	const data = new URLSearchParams();
	data.append('link', urls);
	data.append('downloader', type);

	const headers = {
		Accept: 'application/json, text/javascript, */*; q=0.01',
		'Accept-Language': 'en-US,en;q=0.9',
		Connection: 'keep-alive',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		Cookie: 'PHPSESSID=c1qc786t4r439k0ogf4pb50fgm; _ga_W9Q84JYKKD=GS1.1.1731120140.1.0.1731120140.0.0.0; _ga=GA1.1.979138462.1731120140; __gads=ID=89f41a0cc4734339:T=1731120140:RT=1731120140:S=ALNI_MY2FNGnAVDIkwE35v-IsEMzweOqRQ; __gpi=UID=00000f643ea193e0:T=1731120140:RT=1731120140:S=ALNI_MZrYvEtDAXMOExu4wavywGulS6Vww; __eoi=ID=439a66e4e79cc71a:T=1731120140:RT=1731120140:S=AA-AfjYcG5P7RNtPZLXiHOfQX-lR; FCNEC=%5B%5B%22AKsRol_dAqS6oEYU_-IReCxUk3gKXwJ2xCeHvSlTukmIMcqkQCHNZwEAOtXKQei1epvT9elPBlfUzZXCt90jGPgL2VxRUyCckXJr2GxBFqKEoWr8-2L-T54bWkO_QF6v_biozNwmo9Ka_19Sya7XHyjX40pA30kNuw%3D%3D%22%5D%5D',
		Origin: 'https://indownloader.app',
		Referer: 'https://indownloader.app/',
		'User-Agent': 'MyApp/1.0',
		'X-Requested-With': 'XMLHttpRequest',
	};

	const response = await axios.post(url, data.toString(), { headers });
	const html = response.data.html;
	const $ = cheerio.load(html);
	const thumbnailUrl = $('.post-thumb img').attr('src');
	const videoUrl = $('.download-options a').attr('href');

	return {
		thumbnail: thumbnailUrl,
		download_url: videoUrl,
	};
}

async function twitter(id) {
	try {
		const url = 'https://ssstwitter.com';
		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
			},
		});

		const $ = cheerio.load(response.data);
		const form = $('form.pure-form.pure-g.hide-after-request');
		const includeVals = form.attr('include-vals');
		const ttMatch = includeVals.match(/tt:'([^']+)'/);
		const tsMatch = includeVals.match(/ts:(\d+)/);

		if (!ttMatch || !tsMatch) throw new Error('Cannot find tt or ts values.');

		const tt = ttMatch[1];
		const ts = tsMatch[1];

		const postData = new URLSearchParams({
			tt: tt,
			ts: ts,
			source: 'form',
			id: id,
			locale: 'en',
		});

		const postResponse = await axios.post(url, postData.toString(), {
			headers: {
				'HX-Request': 'true',
				'HX-Target': 'target',
				'HX-Current-URL': 'https://ssstwitter.com/en',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
				Referer: 'https://ssstwitter.com/result_normal',
			},
		});

		const $result = cheerio.load(postResponse.data);
		const downloads = [];
		$result('.result_overlay a.download_link').each((i, element) => {
			const text = $result(element).text().trim();
			const href = $result(element).attr('href');
			if (href && href !== '#') {
				downloads.push({
					text,
					url: href,
				});
			}
		});

		if (downloads.length === 0) throw new Error('No valid download links found.');

		const getHighestQualityVideo = downloads => {
			let highestQuality = downloads[0];

			downloads.forEach(download => {
				const match = download.text.match(/(\d+)x(\d+)/);
				if (match) {
					const [_, width, height] = match;
					if (parseInt(width) > parseInt(highestQuality.text.match(/(\d+)x(\d+)/)[1])) {
						highestQuality = download;
					}
				}
			});

			return highestQuality;
		};

		const highestQualityVideo = getHighestQualityVideo(downloads);
		return highestQualityVideo.url;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

async function tiktok(url) {
	return fetch(`${'https://api.tiklydown.eu.org/api/download?url='}${encodeURIComponent(url)}`)
		.then(response => response.json())
		.then(data => data)
		.catch(error => {
			console.error('Error fetching tiktok data:', error);
			return null;
		});
}

async function gdrivedl(url) {
	return new Promise(async (resolve, reject) => {
		try {
			if (!/drive\.google\.com\/file\/d\//gi.test(url)) return reject('Invalid URL');
			const res = await fetch(url).then(v => v.text());
			const $ = cheerio.load(res);
			const id = url.split('/')[5];
			const data = {
				name: $('head').find('title').text().split('-')[0].trim(),
				download: `https://drive.usercontent.google.com/uc?id=${id}&export=download`,
				link: url,
			};

			resolve(data);
		} catch (e) {
			reject(e);
		}
	});
}

async function facebook(url) {
	try {
		let { data } = await axios.post(
			'https://getmyfb.com/process',
			{
				id: url,
				locale: 'en',
			},
			{
				headers: {
					Accept: '*/*',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					Cookie: `PHPSESSID=k3eqo1f3rsq8fld57fgs9ck0q9; _token=1AHD0rRsiBSwwh7ypRad; __cflb=04dToeZfC9vebXjRcJCMjjSQh5PprejvCpooJf5xhb; _ga=GA1.2.193364307.1690654540; _gid=GA1.2.326360651.1690654544; _gat_UA-3524196-5=1; _ga_96G5RB4BBD=GS1.1.1690654539.1.0.1690654555.0.0.0`,
					Origin: 'https://getmyfb.com',
					Referer: 'https://getmyfb.com/',
					'Hx-Current-Url': 'https://getmyfb.com',
					'Hx-Request': true,
					'Hx-Target': 'target',
					'Hx-Trigger': 'form',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188',
				},
			},
		);

		let $ = cheerio.load(data);
		let urls = [];

		$('ul > li').map((a, b) => {
			urls.push({ quality: $(b).text().trim(), url: $(b).find('a').attr('href') });
		});

		let result = {
			description: $('div.results-item > div.results-item-text').text().trim(),
			urls,
		};

		if (urls.length == 0) return $('h4').text();

		return getRandom(result.urls);
	} catch (e) {
		throw e;
	}
}

export { instagram, twitter, tiktok, gdrivedl, facebook };

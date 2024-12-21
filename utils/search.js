import axios from 'axios';
import * as cheerio from 'cheerio';

export async function stickersearch(query) {
	return new Promise(resolve => {
		axios.get(`https://getstickerpack.com/stickers?query=${query}`).then(
			({ data }) => {
				const $ = cheerio.load(data);
				const link = [];
				$('#stickerPacks > div > div:nth-child(3) > div > a').each(
					function (a, b) {
						link.push($(b).attr('href'));
					},
				);
				let rand = link[Math.floor(Math.random() * link.length)];
				axios.get(rand).then(({ data }) => {
					const $$ = cheerio.load(data);
					const url = [];
					$$('#stickerPack > div > div.row > div > img').each(
						function (a, b) {
							url.push($$(b).attr('src').split('&d=')[0]);
						},
					);
					resolve({
						creator: 'Astro',
						title: $$('#intro > div > div > h1').text(),
						author: $$('#intro > div > div > h5 > a').text(),
						author_link: $$(
							'#intro > div > div > h5 > a',
						).attr('href'),
						sticker: url,
					});
				});
			},
		);
	});
}

export async function Google(query) {
	const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
		query,
	)}`;

	try {
		const response = await axios.get(searchUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
			},
		});

		const $ = cheerio.load(response.data);
		const results = [];

		$('div.g').each((_, element) => {
			const title = $(element).find('h3').text();
			const link = $(element).find('a').attr('href');
			const description = $(element).find('div.VwiC3b').text();

			if (title && link) {
				results.push(
					`Title: ${title}\nLink: ${link}\nDescription: ${description}\n`,
				);
			}
		});

		return results.join('\n');
	} catch (error) {
		throw new Error(`Failed to scrape Google: ${error.message}`);
	}
}

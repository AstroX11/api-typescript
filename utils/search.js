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

export function wallpaper(title, page = 1) {
	return new Promise((resolve, reject) => {
		axios.get(
			`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`,
		).then(({ data }) => {
			let $ = cheerio.load(data);
			let hasil = [];
			$('div.grid-item').each(function (a, b) {
				hasil.push({
					type: $(b).find('div.info > a:nth-child(2)').text(),
					image: $(b).find('img').attr('src'),
				});
			});
			resolve(hasil);
		});
	});
}

export async function wikipedia(query) {
	const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
		query,
	)}&limit=1&format=json`;
	const searchResponse = await axios.get(searchUrl);

	if (searchResponse.data[1].length === 0) {
		return null;
	}

	const articleTitle = searchResponse.data[1][0];
	const articleUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
		articleTitle.replace(/ /g, '_'),
	)}`;
	const pageResponse = await axios.get(articleUrl);

	const $ = cheerio.load(pageResponse.data);
	const paragraphs = $('#mw-content-text p')
		.not('.mw-empty-elt')
		.slice(0, 3)
		.map((_, element) => $(element).text())
		.get();

	return {
		title: articleTitle,
		url: articleUrl,
		extract: paragraphs.join('\n\n'),
	};
}

export async function mediafire(url) {
	let query = await axios.get(url);
	let cher = cheerio.load(query.data);
	let hasil = [];
	let link = cher('a#downloadButton').attr('href');
	let size = cher('a#downloadButton')
		.text()
		.replace('Download', '')
		.replace('(', '')
		.replace(')', '')
		.replace('\n', '')
		.replace('\n', '')
		.replace(' ', '');
	let seplit = link.split('/');
	let author = 'Xasena';
	let nama = seplit[5];
	let mime = nama.split('.');
	mime = mime[1];
	hasil.push({ author, nama, mime, size, link });
	return hasil;
}

export async function Bing(query) {
	try {
		const response = await axios.get(
			'https://www.bing.com/search?q=' + encodeURIComponent(query),
			{
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				},
			},
		);
		const $ = cheerio.load(response.data);

		const results = [];
		$('#b_results > li.b_algo').each((i, element) => {
			if (i < 10) {
				// Limit to 10 results
				const titleElement = $(element).find('h2 a');
				const description = $(element)
					.find('.b_caption p')
					.first()
					.text()
					.trim();

				results.push({
					title: titleElement.text().trim(),
					description: description,
					link: titleElement.attr('href'),
				});
			}
		});

		return results;
	} catch (error) {
		console.error('Error searching Bing:', error);
		return [];
	}
}

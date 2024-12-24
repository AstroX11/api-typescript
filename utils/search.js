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

export async function GizChinaNews() {
	const url = 'https://www.gizchina.com/category/news/';
	try {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		const articles = [];

		// Iterate through each post box to extract titles, links, and descriptions
		$('.vw-post-box').each((i, el) => {
			const title = $(el).find('.vw-post-box__title a').text().trim(); // Trim the title to remove extra spaces/newlines
			const link = $(el).find('.vw-post-box__title a').attr('href'); // Get the link from the <a> tag
			const description = $(el)
				.find('.vw-post-box__excerpt p')
				.text()
				.trim(); // Extract description from the <p> tag

			// Only add the post if it has a title, link, and description
			if (title && link && description) {
				articles.push({ title, link, description });
			}
		});

		return articles;
	} catch (error) {
		console.error('Error fetching GizChina news:', error);
		return [];
	}
}

export async function Yahoo(query) {
	try {
		const searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(
			query,
		)}`;
		const response = await axios.get(searchUrl);
		const $ = cheerio.load(response.data);

		const results = [];
		$('.algo').each((i, element) => {
			results.push({
				title: $(element).find('h3').text().trim(),
				description: $(element).find('.compText').text().trim(),
				url: $(element).find('a').attr('href'),
			});
		});

		return results;
	} catch (error) {
		console.error('Error scraping Yahoo:', error);
		return [];
	}
}

async function fetchForexData(url) {
	try {
		const response = await axios.get(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0 Safari/537.36',
			},
		});
		const html = response.data;
		const $ = cheerio.load(html);

		// Extract header fields
		const headers = [];
		$('.upperLine-MSg2GmPp span').each((_, element) => {
			headers.push($(element).text().trim());
		});

		// Extract row data
		const rowsData = [];
		$(
			'tr.row-RdUXZpkv.listRow, tr.row-RdUXZpkv.listRow.focusedClass.cursor',
		).each((_, row) => {
			const rowData = {};

			// Extract ticker symbol, description, and URL
			const tickerCell = $(row).find('.tickerCell-GrtoTeat');
			rowData['Symbol'] = tickerCell
				.find('a.tickerNameBox-GrtoTeat')
				.text()
				.trim();
			rowData['Description'] = tickerCell
				.find('sup.tickerDescription-GrtoTeat')
				.text()
				.trim();

			// Extract additional fields from row cells
			$(row)
				.find('td.cell-RLhfr_y4')
				.each((index, cell) => {
					const headerName =
						headers[index] || `Column${index + 1}`; // Fallback for missing headers
					rowData[headerName] = $(cell).text().trim();
				});

			rowsData.push(rowData);
		});

		// Rename columns
		const data = rowsData.map(row => ({
			Symbol: row.Symbol,
			Pair: row.Description,
			Price: row.Column2,
			'Change %': row.Column3,
			Change: row.Column4,
			Bid: row.Column5,
			Ask: row.Column6,
			High: row.Column7,
			Low: row.Column8,
			Rating: row.Column9,
		}));

		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}

export async function ForexMajor() {
	return await fetchForexData(
		'https://www.tradingview.com/markets/currencies/rates-major/',
	);
}

export async function ForexMinor() {
	return await fetchForexData(
		'https://www.tradingview.com/markets/currencies/rates-minor/',
	);
}

export async function ForexExotic() {
	return await fetchForexData(
		'https://www.tradingview.com/markets/currencies/rates-exotic/',
	);
}

export async function ForexAmericas() {
	return await fetchForexData(
		'https://www.tradingview.com/markets/currencies/rates-americas/',
	);
}

export async function ForexEurope() {
	return await fetchForexData(
		'https://www.tradingview.com/markets/currencies/rates-europe/',
	);
}

export async function ForexAsia() {
	return await fetchForexData(
		'https://www.tradingview.com/markets/currencies/rates-asia/',
	);
}

export async function ForexPacific() {
	return await fetchForexData(
		'https://www.tradingview.com/markets/currencies/rates-pacific/',
	);
}

export async function ForexAfrica() {
	return await fetchForexData(
		'https://www.tradingview.com/markets/currencies/rates-africa/',
	);
}

export async function FootballNews() {
	try {
		const response = await axios.get(
			'https://www.eurosport.com/football/',
			{
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
					Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
					'Accept-Language': 'en-US,en;q=0.5',
					'Accept-Encoding': 'gzip, deflate, br',
					Connection: 'keep-alive',
				},
			},
		);
		const html = response.data;
		const $ = cheerio.load(html);

		const newsItems = [];

		$('div.flex.flex-col').each((index, element) => {
			const title = $(element)
				.find('h3.card-hover-underline')
				.text()
				.trim();
			const url = $(element).find('a').attr('href');
			if (title && url) {
				newsItems.push({ title, url });
			}
		});

		return newsItems;
	} catch (error) {
		console.error('Error fetching football news:', error);
		return null;
	}
}

export async function getAirQualityForecast(country, city) {
	try {
		const url = `https://www.iqair.com/${country.toLowerCase()}/${city.toLowerCase()}`;
		const headers = {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
		};

		const response = await axios.get(url, { headers });
		const html = response.data;
		const $ = cheerio.load(html);

		// Extract subtitles
		const dailyForecastTitle = $(
			'.top-info-left .component-card__title',
		).text();
		const airQualitySubtitle = $(
			'.top-info-left .component-card__description',
		).text();

		// Extract air quality status and main pollutant
		const aqiValue = $('.aqi-value__estimated').text().trim();
		const aqiStatus = $('.aqi-text__status').first().text().trim();
		const mainPollutant = $(
			'.aqi-overview-footer-container__main-pollutant .aqi-text__status',
		)
			.text()
			.trim();
		const mainPollutantValue = $('.aqi-text__value')
			.first()
			.text()
			.trim();

		// Extract day-by-day forecast
		const forecast = [];
		$('table[title] tbody tr').each((_, row) => {
			const day = $(row).find('.day-label').text().trim();
			const aqi = $(row).find('.aqi-chip').text().trim();
			const rainProbability =
				$(row).find('.probability-of-rain').text().trim() || 'N/A';
			const maxTemp = $(row).find('.temp-max').text().trim();
			const minTemp = $(row).find('.temp-min').text().trim();
			const windSpeed = $(row).find('.wind-speed').text().trim();
			const humidity = $(row)
				.find('.humidity p')
				.first()
				.text()
				.trim();

			if (day && aqi && maxTemp && minTemp && windSpeed) {
				forecast.push({
					day,
					aqi,
					rainProbability,
					maxTemp,
					minTemp,
					windSpeed,
					humidity,
				});
			}
		});

		return {
			dailyForecastTitle,
			airQualitySubtitle,
			current: {
				aqiValue,
				aqiStatus,
				mainPollutant,
				mainPollutantValue,
			},
			forecast,
		};
	} catch (error) {
		console.error('Error fetching air quality forecast:', error);
		throw error;
	}
}

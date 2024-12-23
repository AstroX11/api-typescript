import axios from 'axios';
import * as cheerio from 'cheerio';

export async function AnimeNews() {
	try {
		const response = await axios.get('https://aniverse-mag.com/');
		const html = response.data;
		const $ = cheerio.load(html);
		const articles = [];

		$('.cb-meta.clearfix').each((index, element) => {
			const title = $(element).find('.cb-post-title a').text();
			const description = $(element).find('.cb-excerpt').text().trim();
			const link = $(element).find('.cb-post-title a').attr('href');
			articles.push({ title, description, link });
		});

		return articles;
	} catch (error) {
		console.error('Error fetching anime news:', error);
		return null;
	}
}
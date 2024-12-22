import axios from 'axios';
import * as cheerio from 'cheerio';

async function Bing(query) {
	try {
		const response = await axios.get('https://www.bing.com/search?q=' + encodeURIComponent(query), {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});
		const $ = cheerio.load(response.data);
		
		const results = [];
		$('#b_results > li.b_algo').each((i, element) => {
			if (i < 10) {  // Limit to 10 results
				const titleElement = $(element).find('h2 a');
				const description = $(element).find('.b_caption p').first().text().trim();
				
				results.push({
					title: titleElement.text().trim(),
					description: description,
					link: titleElement.attr('href')
				});
			}
		});
		
		return results;
	} catch (error) {
		console.error('Error searching Bing:', error);
		return [];
	}
}
console.log(await Bing('Node Js'))
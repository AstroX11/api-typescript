import axios from 'axios';
import * as cheerio from 'cheerio';

function wallpaper(title, page = 1) {
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

console.log(await wallpaper('Messi'))
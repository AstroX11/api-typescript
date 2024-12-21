import axios from 'axios';
import * as cheerio from 'cheerio';

async function mediafire(url) {
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

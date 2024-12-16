import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import FormData from 'form-data';
import { BitlyClient } from 'bitly';
import PDFDocument from 'pdfkit';
import { FileTypeFromBuffer, getBuffer, getJson } from 'xstro-utils';

const factsPath = path.join('./json/facts.json');
const quotesPath = path.join('./json/quotes.json');

async function readJsonFile(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}

async function textToPdf(content) {
	const isText = typeof content === 'string';
	const doc = new PDFDocument();
	if (isText) {
		doc.text(content);
	} else {
		const { data } = content;
		doc.image(data, { fit: [500, 500] });
	}

	doc.end();
	const buffers = [];
	for await (const chunk of doc) buffers.push(chunk);
	return Buffer.concat(buffers);
}

async function facts() {
	const data = await readJsonFile(factsPath);
	const randomIndex = Math.floor(Math.random() * data.facts.length);
	return data.facts[randomIndex];
}

async function quotes() {
	const data = await readJsonFile(quotesPath);
	const randomIndex = Math.floor(Math.random() * data.quotes.length);
	return data.quotes[randomIndex];
}

async function rizz() {
	const data = await getJson('https://rizzapi.vercel.app/random');
	return data.text;
}

async function bible(verse) {
	const data = await getJson(`https://bible-api.com/${verse}`);
	return data.text;
}

async function fancy(text) {
	const response = await axios.get('http://qaz.wtf/u/convert.cgi', {
		params: { text },
	});
	const $ = cheerio.load(response.data);
	const results = [];
	$('table > tbody > tr').each(function () {
		results.push({
			name: $(this).find('td:nth-child(1) > h6 > a').text(),
			result: $(this).find('td:nth-child(2)').text().trim(),
		});
	});
	return results.map(item => item.result).join('\n');
}

async function removeBg(buffer) {
	const formData = new FormData();
	const type = await FileTypeFromBuffer(buffer);
	const inputPath = path.join(process.cwd(), `temp_image.${type}`);
	fs.writeFileSync(inputPath, buffer);
	formData.append('size', 'auto');
	formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
	const { status, data } = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
		responseType: 'arraybuffer',
		headers: {
			...formData.getHeaders(),
			'X-Api-Key': 'FjyTadatkyWixWGWUCUDTF7J',
		},
		encoding: null,
	});
	fs.unlinkSync(inputPath);
	return data;
}

async function tinyurl(url) {
	const response = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);
	return await response.text();
}

export { shortenUrl, textToPdf, facts, quotes, rizz, bible, fancy, removeBg, tinyurl };

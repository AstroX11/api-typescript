import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import PDFDocument from 'pdfkit';
import { getJson } from 'xstro-utils';
import { translate } from '@vitalets/google-translate-api';

const factsPath = path.join('./json/facts.json');
const quotesPath = path.join('./json/quotes.json');
const advicePath = path.join('./json/advice.json');

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

async function advice() {
	const data = await readJsonFile(advicePath);
	return getRandom(data);
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

async function tinyurl(url) {
	const response = await fetch(
		`https://tinyurl.com/api-create.php?url=${url}`,
	);
	return await response.text();
}

const solveMath = expression => {
	if (typeof expression !== 'string')
		return 'Invalid input: expression must be a string';

	const sanitizedExpression = expression
		.replace(/[^0-9+\-*/().√^%\s]/g, '')
		.trim();
	if (!sanitizedExpression || sanitizedExpression.length === 0)
		return 'Empty expression';

	try {
		let processedExpression = sanitizedExpression
			.replace(/√/g, 'Math.sqrt')
			.replace(/\^/g, '**')
			.replace(/\s+/g, '');
		const safeEval = new Function(`
            "use strict";
            try {
                return String(${processedExpression});
            } catch (error) {
                return 'Evaluation error';
            }
        `);

		const result = safeEval();
		if (result === null || result === undefined) return 'Invalid result';

		if (Number.isNaN(Number(result)) || !Number.isFinite(Number(result)))
			return 'Mathematical error';

		return String(Number(result).toPrecision(15)).replace(/\.?0+$/, '');
	} catch (error) {
		return 'Invalid expression';
	}
};

const getRandom = array => {
	if (array.length === 0) return undefined;
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
};

const trt = async (sentence, targetLang) => {
	try {
		const result = await translate(sentence, { to: targetLang });
		return result.text;
	} catch (error) {
		throw new Error(`Translation failed: ${error.message}`);
	}
};
export {
	textToPdf,
	facts,
	quotes,
	advice,
	rizz,
	bible,
	fancy,
	tinyurl,
	solveMath,
	getRandom,
	trt
};

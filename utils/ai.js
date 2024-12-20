'use strict';

import axios from 'axios';

/**
 * @typedef {Class} Hercai
 * @see {Hercai}
 * @param {Class} Hercai
 * @example const { Hercai } = require("hercai");
 * @example import { Hercai } from "hercai";
 * @type {Class}
 * @class
 */
export class Hercai {
	async question({ model = 'v3', content }) {
		if (!['v3', 'v3-32k', 'turbo', 'turbo-16k', 'gemini'].some(ind => model == ind)) model = 'v3';
		if (!content || content == undefined || content == null) throw new Error('Please specify a question!');
		try {
			var api = await axios.get(`https://hercai.onrender.com/${model}/hercai?question=` + encodeURI(content), {
				headers: {
					'content-type': 'application/json',
				},
			});
			return api.data;
		} catch (err) {
			throw new Error('Error: ' + err.message);
		}
	}
	async drawImage({ model = 'v3', prompt }) {
		if (!['v3', 'lexica', 'animefy', 'raava', 'shonin'].some(ind => model == ind)) model = 'v3';
		if (!prompt || prompt == undefined || prompt == null) throw new Error('Please specify a prompt!');
		try {
			var api = await axios.get(`https://hercai.onrender.com/${model}/text2image` + '?prompt=' + encodeURI(prompt), {
				headers: {
					'content-type': 'application/json',
				},
			});
			return api.data;
		} catch (err) {
			throw new Error('Error: ' + err.message);
		}
	}
}

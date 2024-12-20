import jsobfus from 'javascript-obfuscator';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';

async function obfus(query) {
	return new Promise((resolve, reject) => {
		try {
			const obfuscationResult = jsobfus.obfuscate(query, {
				compact: true,
				controlFlowFlattening: true,
				controlFlowFlatteningThreshold: 1,
				numbersToExpressions: true,
				simplify: true,
				stringArrayShuffle: true,
				splitStrings: true,
				stringArrayThreshold: 1,
			});
			const result = {
				status: 200,
				author: `Astro`,
				result: obfuscationResult.getObfuscatedCode(),
			};
			resolve(result);
		} catch (e) {
			reject(e);
		}
	});
}

async function ttp(text) {
	try {
		const response = await fetch('https://www.picturetopeople.org/p2p/text_effects_generator.p2p/transparent_text_effect', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
				Cookie: '_ga=GA1.2.1667267761.1655982457; _gid=GA1.2.77586860.1655982457; __gads=ID=c5a896288a559a38-224105aab0d30085:T=1655982456:RT=1655982456:S=ALNI_MbtHcmgQmVUZI-a2agP40JXqeRnyQ; __gpi=UID=000006149da5cba6:T=1655982456:RT=1655982456:S=ALNI_MY1RmQtva14GH-aAPr7-7vWpxWtmg; _gat_gtag_UA_6584688_1=1',
			},
			body: new URLSearchParams({
				TextToRender: text,
				FontSize: '100',
				Margin: '30',
				LayoutStyle: '0',
				TextRotation: '0',
				TextColor: 'ffffff',
				TextTransparency: '0',
				OutlineThickness: '3',
				OutlineColor: '000000',
				FontName: 'Lekton',
				ResultType: 'view',
			}).toString(),
		});

		const bodyText = await response.text();
		const $ = cheerio.load(bodyText);
		const results = [];
		$('form[name="MyForm"]').each((index, formElement) => {
			const resultFile = $(formElement).find('#idResultFile').attr('value');
			const refTS = $(formElement).find('#idRefTS').attr('value');
			results.push({
				url: 'https://www.picturetopeople.org' + resultFile,
				title: refTS,
			});
		});

		return results;
	} catch (error) {
		console.error('Error:', error);
		return [];
	}
}


async function githubstalk(user) {
	return new Promise((resolve, reject) => {
		axios.get('https://api.github.com/users/' + user).then(({ data }) => {
			let hasil = {
				username: data.login,
				nickname: data.name,
				bio: data.bio,
				id: data.id,
				nodeId: data.node_id,
				profile_pic: data.avatar_url,
				url: data.html_url,
				type: data.type,
				admin: data.site_admin,
				company: data.company,
				blog: data.blog,
				location: data.location,
				email: data.email,
				public_repo: data.public_repos,
				public_gists: data.public_gists,
				followers: data.followers,
				following: data.following,
				ceated_at: data.created_at,
				updated_at: data.updated_at,
			};
			resolve(hasil);
		});
	});
}

export { obfus, ttp, githubstalk };

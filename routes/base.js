import express from 'express';
import { textToPdf, facts, quotes, rizz, bible, fancy, tinyurl, solveMath, advice, trt } from '../utils/misc.js';

const router = express.Router();

// GET route for facts
router.get('/facts', async (req, res) => {
	try {
		const fact = await facts();
		res.json({ success: true, fact });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for quotes
router.get('/quotes', async (req, res) => {
	try {
		const quote = await quotes();
		res.json({ success: true, quote });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for advice
router.get('/advice', async (req, res) => {
	try {
		const data = await advice();
		res.json({ success: true, advice: data.quote });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for rizz
router.get('/rizz', async (req, res) => {
	try {
		const text = await rizz();
		res.json({ success: true, text });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for bible
router.get('/bible', async (req, res) => {
	try {
		const { verse } = req.query;
		if (!verse) return res.status(400).json({ success: false, error: 'Verse is required' });
		const text = await bible(verse);
		res.json({ success: true, text });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for fancy text
router.get('/fancy', async (req, res) => {
	try {
		const { text } = req.query;
		if (!text) return res.status(400).json({ success: false, error: 'Text is required' });
		const result = await fancy(text);
		res.json({ success: true, result });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for shorten URL using TinyURL
router.get('/tinyurl', async (req, res) => {
	try {
		const { url } = req.query;
		if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
		const result = await tinyurl(url);
		res.json({ success: true, result });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for text to PDF
router.get('/textToPdf', async (req, res) => {
	try {
		const { content } = req.query;
		if (!content) return res.status(400).json({ success: false, error: 'Content is required' });
		const buffer = await textToPdf(content);
		res.set('Content-Type', 'application/pdf');
		res.send(buffer);
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for solve math
router.get('/solveMath', async (req, res) => {
	try {
		const { expression } = req.query;
		if (!expression) return res.status(400).json({ success: false, error: 'Math expression is required' });
		const result = solveMath(expression);
		res.json({ success: true, result });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET route for translate
router.get('/translate', async (req, res) => {
	try {
		const { text, to } = req.query;
		if (!text) return res.status(400).json({ success: false, error: 'Text is required' });
		if (!to) return res.status(400).json({ success: false, error: 'Target language is required' });
		const result = await trt(text, to);
		res.json({ success: true, result });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

export default router;

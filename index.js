import express from 'express';
import { tmpdir } from 'os';
import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import apiRouter from './routes/api.js';
import uploadRouter from './routes/uploadmedia.js';
import opusRouter from './routes/opusConverter.js';
import shortenUrl from './routes/bitly.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRouter);
app.use('/api', uploadRouter);
app.use('/api', opusRouter);
app.get('/api/shorten', shortenUrl);
app.get('/temp/:filename', (req, res) => {
	const filePath = join(tmpdir(), req.params.filename);
	if (existsSync(filePath)) {
		res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
		createReadStream(filePath).pipe(res);
	} else {
		res.status(404).send('File not found');
	}
});

app.get('/', (req, res) => {
	res.send('Made By Astro');
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

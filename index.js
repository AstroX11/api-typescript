import express from 'express';
import bodyParser from 'body-parser';
import { join } from 'path';
import Router1 from './routes/base.js';
import Router2 from './routes/ffmpeg.js';
import Router3 from './routes/downloaders.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', Router1);
app.use('/api', Router2);
app.use('/api', Router3);

app.get('/', (_, res) => {
	res.sendFile(join(process.cwd(), 'web', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

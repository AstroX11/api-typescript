import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import Router1 from './routes/base.js';
import Router3 from './routes/downloaders.js';
import Router5 from './routes/tools.js';
import Router6 from './routes/ai.js';
import Router7 from './routes/search.js';
import Router8 from './routes/anime.js';
import Router9 from './routes/meme.js';
import uploadRouter from './routes/_upload.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.set('json spaces', 2);

app.use(express.json());
app.use('/api', Router1);
app.use('/api', Router3);
app.use('/api', Router5);
app.use('/api', Router6);
app.use('/api', Router7);
app.use('/api', Router8);
app.use('/api', Router9);
app.use('/api/upload', uploadRouter);

app.get('/', (_, res) => {
	res.sendFile(path.join(process.cwd(), 'web', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

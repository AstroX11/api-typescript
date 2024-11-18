import express from 'express';
import apiRouter from './routes/api.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
	res.send('Made By Astro');
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

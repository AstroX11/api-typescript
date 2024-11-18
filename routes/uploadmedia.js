import { Router } from 'express';
import multer from 'multer';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fileTypeFromBuffer } from 'file-type';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('media'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		const { buffer } = req.file;
		const { ext, mime } = await fileTypeFromBuffer(buffer);

		if (!ext || !['image', 'video', 'audio'].includes(mime.split('/')[0])) {
			return res.status(400).json({ error: 'Invalid media type' });
		}

		const fileName = `uploaded-${Date.now()}.${ext}`;
		const filePath = join(tmpdir(), fileName);
		writeFileSync(filePath, buffer);

		setTimeout(() => {
			unlinkSync(filePath);
		}, 24 * 60 * 60 * 1000);

		const tempUrl = `${req.protocol}://${req.get('host')}/temp/${fileName}`;
		res.json({ url: tempUrl });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;

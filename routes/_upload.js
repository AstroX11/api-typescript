import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import mime from 'mime-types';
import * as FileType from 'file-type';

const router = express.Router();

// Helper function to detect file type
async function detectFileType(filepath) {
	try {
		const buffer = await fs.readFile(filepath);
		const fileType = await FileType.fileTypeFromBuffer(buffer);
		return (
			fileType || {
				ext: mime.extension(mime.lookup(filepath)) || 'bin',
				mime: mime.lookup(filepath) || 'application/octet-stream',
			}
		);
	} catch (error) {
		console.error('Error detecting file type:', error);
		return {
			ext: 'bin',
			mime: 'application/octet-stream',
		};
	}
}

// Helper function to process a single file
async function processUploadedFile(file, req) {
	const originalFilePath = path.join(
		process.cwd(),
		'uploads',
		file.filename,
	);

	// Detect actual file type
	const fileType = await detectFileType(originalFilePath);

	// Get original extension from filename if it exists
	const originalExt = path.extname(file.originalname).slice(1);

	// Use original extension if it matches detected mime type, otherwise use detected extension
	const finalExt =
		originalExt && mime.lookup(`.${originalExt}`) === fileType.mime
			? originalExt
			: fileType.ext;

	// Generate new filename with correct extension
	const uniqueId = path.basename(file.filename, '-temp');
	const originalName = path.basename(
		file.originalname,
		path.extname(file.originalname),
	);
	const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '-');
	const newFilename = `${sanitizedName}-${uniqueId}.${finalExt}`;
	const newFilePath = path.join(process.cwd(), 'uploads', newFilename);

	// Rename file with correct extension
	await fs.rename(originalFilePath, newFilePath);

	// Set expiration time (30 minutes from now)
	const expiresAt = Date.now() + 30 * 60 * 1000;

	// Store file metadata
	uploadedFiles.set(newFilename, {
		originalname: `${originalName}.${finalExt}`,
		mimetype: fileType.mime,
		size: file.size,
		expiresAt,
	});

	// Generate URLs with detected extension
	const encodedOriginalName = encodeURIComponent(
		`${originalName}.${finalExt}`,
	);
	const fileUrl = `${req.protocol}://${req.get(
		'host',
	)}/api/upload/files/${newFilename}/${encodedOriginalName}`;
	const rawUrl = `${req.protocol}://${req.get(
		'host',
	)}/api/upload/raw/${newFilename}/${encodedOriginalName}`;

	return {
		message: 'File uploaded successfully',
		fileUrl,
		rawUrl,
		expiresAt: new Date(expiresAt).toISOString(),
		originalname: `${originalName}.${finalExt}`,
		size: file.size,
		type: fileType.mime,
	};
}

// Configure multer for file upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = path.join(process.cwd(), 'uploads');
		// Create uploads directory if it doesn't exist
		fs.mkdir(uploadDir, { recursive: true })
			.then(() => cb(null, uploadDir))
			.catch(err => cb(err));
	},
	filename: (req, file, cb) => {
		// Initially save with temporary name
		const uniqueId = uuidv4();
		const tempName = `${uniqueId}-temp`;
		cb(null, tempName);
	},
});

const upload = multer({ storage });

// Store file metadata and expiration times
const uploadedFiles = new Map();

// Clean up expired files periodically
setInterval(async () => {
	const now = Date.now();
	for (const [filename, metadata] of uploadedFiles.entries()) {
		if (now >= metadata.expiresAt) {
			try {
				await fs.unlink(
					path.join(process.cwd(), 'uploads', filename),
				);
				uploadedFiles.delete(filename);
				console.log(`Deleted expired file: ${filename}`);
			} catch (error) {
				console.error(`Error deleting file ${filename}:`, error);
			}
		}
	}
}, 5 * 60 * 1000); // Check every 5 minutes

// Multiple files upload route
router.post('/', upload.array('files', 10), async (req, res) => {
	try {
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ error: 'No files uploaded' });
		}

		// Process all files in parallel
		const results = await Promise.all(
			req.files.map(file => processUploadedFile(file, req)),
		);

		// If single file was uploaded, return single result
		if (results.length === 1) {
			res.json(results[0]);
		} else {
			// Otherwise return array of results
			res.json(results);
		}
	} catch (error) {
		console.error('Upload error:', error);
		res.status(500).json({ error: 'File upload failed' });
	}
});

// File access route with content disposition for download
router.get('/files/:filename/:originalname', async (req, res) => {
	const { filename } = req.params;
	const fileMetadata = uploadedFiles.get(filename);

	if (!fileMetadata) {
		return res.status(404).json({ error: 'File not found or expired' });
	}

	if (Date.now() >= fileMetadata.expiresAt) {
		uploadedFiles.delete(filename);
		try {
			await fs.unlink(path.join(process.cwd(), 'uploads', filename));
		} catch (error) {
			console.error(`Error deleting expired file ${filename}:`, error);
		}
		return res.status(404).json({ error: 'File has expired' });
	}

	res.setHeader(
		'Content-Disposition',
		`attachment; filename="${fileMetadata.originalname}"`,
	);
	res.setHeader('Content-Type', fileMetadata.mimetype);
	res.sendFile(path.join(process.cwd(), 'uploads', filename));
});

// Raw file access route for direct viewing
router.get('/raw/:filename/:originalname', async (req, res) => {
	const { filename } = req.params;
	const fileMetadata = uploadedFiles.get(filename);

	if (!fileMetadata) {
		return res.status(404).json({ error: 'File not found or expired' });
	}

	if (Date.now() >= fileMetadata.expiresAt) {
		uploadedFiles.delete(filename);
		try {
			await fs.unlink(path.join(process.cwd(), 'uploads', filename));
		} catch (error) {
			console.error(`Error deleting expired file ${filename}:`, error);
		}
		return res.status(404).json({ error: 'File has expired' });
	}

	res.setHeader('Content-Type', fileMetadata.mimetype);
	if (fileMetadata.mimetype.startsWith('text/')) {
		res.setHeader(
			'Content-Type',
			`${fileMetadata.mimetype}; charset=utf-8`,
		);
	}

	res.sendFile(path.join(process.cwd(), 'uploads', filename));
});

export default router;

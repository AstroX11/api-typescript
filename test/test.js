// apiClient.js
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Handles file uploads to the API
 * @param {string} url - The API endpoint URL
 * @param {Object} data - Object containing file and optional metadata
 * @param {File|Blob|Buffer} data.file - The file to upload
 * @param {Object} [options] - Additional options for the request
 * @param {Object} [options.headers] - Additional headers to include
 * @param {number} [options.timeout] - Request timeout in milliseconds
 * @param {AbortSignal} [options.signal] - AbortController signal
 * @returns {Promise<Object>} - Response data including the file URLs
 */
async function postUpload(url, data, options = {}) {
    try {
        // Create FormData instance
        const formData = new FormData();
        
        // Handle different types of file inputs
        if (data.file instanceof File || data.file instanceof Blob) {
            // If it's a Blob without a name, try to generate one
            if (data.file instanceof Blob && !data.file.name) {
                const ext = data.file.type ? `.${data.file.type.split('/')[1]}` : '';
                formData.append('file', data.file, `file${ext}`);
            } else {
                formData.append('file', data.file);
            }
        } else if (Buffer.isBuffer(data.file)) {
            // Handle Buffer (Node.js) by converting to Blob
            const blob = new Blob([data.file]);
            formData.append('file', blob, data.filename || 'file.bin');
        } else {
            throw new Error('Invalid file type. Expected File, Blob, or Buffer.');
        }

        // Add any additional metadata fields
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'file' && value !== undefined) {
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
            }
        });

        // Prepare fetch options
        const fetchOptions = {
            method: 'POST',
            body: formData,
            headers: {
                ...options.headers,
            },
            signal: options.signal,
        };

        // Set up timeout if specified
        let timeoutId;
        if (options.timeout) {
            const controller = new AbortController();
            if (!options.signal) {
                fetchOptions.signal = controller.signal;
            }
            timeoutId = setTimeout(() => controller.abort(), options.timeout);
        }

        try {
            const response = await fetch(url, fetchOptions);
            
            // Parse response
            const responseData = await response.json();

            // Check if response is ok
            if (!response.ok) {
                throw new ApiError(
                    responseData.message || 'Upload failed',
                    response.status,
                    responseData
                );
            }

            return responseData;
        } finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new ApiError('Request timed out', 408);
        }
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(error.message, 500);
    }
}

// Usage example:
async function uploadFile(file, baseUrl = 'http://localhost:3000') {
    try {
        const response = await postUpload(`${baseUrl}/api/upload`, {
            file,
            // Add any additional metadata here
        }, {
            timeout: 30000, // 30 second timeout
            headers: {
                // Add any custom headers here
            }
        });
        
        return {
            success: true,
            fileUrl: response.fileUrl,    // URL for downloading the file
            rawUrl: response.rawUrl,      // URL for viewing the file directly
            expiresAt: response.expiresAt,
            originalname: response.originalname,
            size: response.size,
            type: response.type           // Detected MIME type
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            status: error.status
        };
    }
}

export { postUpload, uploadFile, ApiError };

import fs from 'fs/promises';

const fileBuffer = await fs.readFile('audio.mp3');
const result = await uploadFile(fileBuffer);

console.log(result);

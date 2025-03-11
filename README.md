# MultiMedia API Server

A powerful and versatile server providing various multimedia APIs and tools, built with Node.js and Express.js.

## 📋 Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)
- [Development](#development)

## ✨ Features

The server provides multiple API endpoints categorized into:
- Base Operations
- Downloader Services
- Tool Utilities
- AI Services
- Search Functionality
- Anime-related Services
- Meme Generation
- File Upload Capabilities

## 🔧 Requirements

- Node.js 20.x or higher
- NPM or Yarn package manager
- System dependencies for image processing and browser automation

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/AstroX11/api-typescript.git

# Navigate to project directory
cd api-typescript

# Install dependencies
yarn install
# or
npm install

# Start the server
yarn start
# or
npm start
```

## 🐳 Docker Setup

The project includes a comprehensive Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t multimedia-api .

# Run the container
docker run -p 3000:3000 multimedia-api
```

### System Dependencies
The Dockerfile includes all necessary system dependencies for:
- Canvas operations
- Puppeteer automation
- Font rendering
- Image processing
- PDF generation

## 🛣️ API Routes

The server exposes several route categories under the `/api` endpoint:

1. **Base Routes** (`/api/`)
   - Basic API operations and utilities

2. **Downloaders** (`/api/`)
   - Media download functionalities

3. **Tools** (`/api/`)
   - Utility functions and tools

4. **AI Services** (`/api/`)
   - AI-powered functionalities

5. **Search** (`/api/`)
   - Search-related endpoints

6. **Anime** (`/api/`)
   - Anime-related services

7. **Meme** (`/api/`)
   - Meme generation and processing

8. **Upload** (`/api/upload`)
   - File upload handling

## 🔑 Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (production/development)
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: Skip Chromium download when using Docker
- `PUPPETEER_EXECUTABLE_PATH`: Custom Chromium path
- `PUPPETEER_ARGS`: Browser launch arguments

## 📦 Dependencies

### Core Dependencies
- `express`: Web framework
- `axios`: HTTP client
- `puppeteer`: Browser automation
- `sharp`: Image processing
- `canvas`: Graphics processing

### Media Processing
- `node-webpmux`: WebP image handling
- `pdfkit`: PDF generation
- `file-type`: File type detection

### Utilities
- `@vitalets/google-translate-api`: Translation services
- `cheerio`: HTML parsing
- `javascript-obfuscator`: Code obfuscation
- `multer`: File upload handling
- `uuid`: Unique ID generation
- `xstro-utils`: Utility functions

## 💻 Development

```bash
# Start in development mode
yarn dev
# or
npm run dev
```

### Project Structure
```
api-typescript/
├── index.js          # Main application entry
├── routes/           # API route definitions
│   ├── base.js
│   ├── downloaders.js
│   ├── tools.js
│   ├── ai.js
│   ├── search.js
│   ├── anime.js
│   ├── meme.js
│   └── _upload.js
├── web/             # Web interface files
└── Dockerfile       # Container configuration
```

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

- **AstroX11**

---

For more information or support, please open an issue in the GitHub repository.

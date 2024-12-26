# Use the official Node.js image as a base image
FROM node:20-slim

# Set environment variables
ENV NODE_ENV=production

# Install system dependencies for canvas and Puppeteer
RUN apt-get update && apt-get install -y \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    python3 \
    build-essential \
    # Puppeteer Dependencies
    chromium \
    chromium-driver \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    # Additional dependencies for running Chrome
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=true

# Copy the rest of the application code
COPY . .

# Configure Chrome Sandbox
RUN chmod 755 /usr/bin/chromium && \
    chown root:root /usr/bin/chromium && \
    chmod 4755 /usr/lib/chromium/chrome-sandbox && \
    chown root:root /usr/lib/chromium/chrome-sandbox

# Set Puppeteer configurations
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Either run with no sandbox (less secure) or ensure proper sandbox setup
ENV PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox"

# Set the default port for Heroku
ENV PORT=3000
EXPOSE $PORT

# Start the application
CMD ["yarn", "start"]
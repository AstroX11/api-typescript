# Use the official Node.js image as a base image
FROM node:20-slim

# Set environment variables
ENV NODE_ENV=production

# Install system dependencies for canvas
RUN apt-get update && apt-get install -y \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=true

# Copy the rest of the application code
COPY . .

# Set the default port for Heroku
ENV PORT=3000
EXPOSE $PORT

# Start the application
CMD ["yarn", "start"]

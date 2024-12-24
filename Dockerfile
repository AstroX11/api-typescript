# Use an official Node.js image as the base image
FROM node:18

# Install necessary system dependencies for canvas
RUN apt-get update && \
    apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files into the container
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the app
CMD ["yarn", "start"] 

# Use the Node.js 20 base image
FROM node:22.16.0-bookworm-slim


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm i

# Install ffmpeg and other necessary packages
# RUN apk update
# RUN apk upgrade
# RUN apk add --no-cache ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Command to run the application
CMD ["npm", "run", "prod"]


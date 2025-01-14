# Use the official Node.js image from the Docker Hub
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the app on a specific port
EXPOSE 3000

# Command to run your server
CMD [ "node", "server.js" ]
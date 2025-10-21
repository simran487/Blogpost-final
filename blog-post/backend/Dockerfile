# Use Node.js image
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the rest of your backend files
COPY . .

EXPOSE 5000
CMD ["npm", "start"]

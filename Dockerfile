FROM node:12-alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
#RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]

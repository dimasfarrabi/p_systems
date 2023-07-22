FROM node:14

WORKDIR /check-in-sender
COPY package.json .
RUN npm install
COPY . .
CMD npm start
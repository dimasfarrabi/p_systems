FROM node:14

WORKDIR /check-in-receiver
COPY package.json .
RUN npm install
COPY . .
CMD npm start
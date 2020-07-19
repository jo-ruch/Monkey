FROM node:10

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Install front-end dependencies
RUN cd public && npm install

EXPOSE 3000

CMD ["npm", "start"]

FROM node:${TAG}-slim

WORKDIR /code

COPY package.json ./

RUN npm install

COPY src/ ./

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
FROM node:22-alpine

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /bot

COPY package.json yarn.lock ./
RUN yarn install 

COPY . .

RUN yarn build

EXPOSE 5000
CMD ["yarn", "start:prod"]

FROM node:22-alpine AS builder
WORKDIR /bot
COPY . .
RUN yarn install
RUN yarn build

FROM node:22-alpine
WORKDIR /bot

COPY --from=builder /bot/dist ./dist
COPY --from=builder /bot/node_modules ./node_modules
COPY --from=builder /bot/package.json ./package.json

CMD ["yarn", "start"]

FROM node:18-alpine as deps
WORKDIR /app

COPY package.json .babelrc ./
RUN npm install

FROM node:18-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /app

COPY package.json .babelrc ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
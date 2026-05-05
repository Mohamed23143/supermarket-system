FROM node:20-alpine

RUN npm install -g pnpm
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
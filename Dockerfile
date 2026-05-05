FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN pnpm install --prod
EXPOSE 3000
CMD ["node", "dist/index.js"]
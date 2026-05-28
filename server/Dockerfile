# Backend Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base AS build
COPY . .
RUN npm install && npm run build # If there's a build step

FROM base AS production
COPY --from=build /app .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]

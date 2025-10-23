FROM node:20-alpine as deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
# Call vite via node to avoid executable permission issues in some environments
RUN node ./node_modules/vite/bin/vite.js build

# Default (final) stage for development: run Vite dev server
FROM node:20-alpine as dev
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV VITE_API_BASE_URL="http://localhost:8001"
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

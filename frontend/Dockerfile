# Frontend Dockerfile - Vite dev server
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm i; fi

# Copy source
COPY . .

EXPOSE 3000

# Default command runs Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

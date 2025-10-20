# Frontend Dockerfile - optimized for dev with volume mounts
FROM node:20-alpine

WORKDIR /app

EXPOSE 3000

# Install deps on container start if vite is missing in node_modules (named volume may start empty)
CMD ["sh", "-lc", "if [ ! -f node_modules/.bin/vite ]; then echo 'node_modules missing vite; running npm ci...' && npm ci; fi; exec npm run dev -- --host 0.0.0.0"]

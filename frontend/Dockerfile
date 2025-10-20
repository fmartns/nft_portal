# Frontend Dockerfile - optimized for dev with volume mounts
FROM node:20-alpine

WORKDIR /app

EXPOSE 3000

# Install deps on container start only if node_modules doesn't exist (persisted via volume)
CMD ["sh", "-c", "if [ ! -d node_modules ]; then npm ci; fi; npm run dev -- --host 0.0.0.0"]

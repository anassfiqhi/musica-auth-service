# Single stage - build and run
FROM node:22-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build TypeScript with explicit error handling
RUN echo "Building TypeScript..." && pnpm run build && echo "Build successful" || (echo "Build failed" && exit 1)
RUN echo "Checking dist folder:" && ls -laR dist/

# Remove dev dependencies
RUN pnpm prune --prod

# Set environment
ENV NODE_ENV=production
EXPOSE 3005

# Start application
CMD ["node", "dist/index.js"]

FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Development stage
FROM base as development
# Copy package files first to leverage layer caching
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Build stage
FROM base as builder
# Copy package files first to leverage layer caching
COPY package*.json ./
RUN npm install
# Copy source files and env file in one layer
COPY . .
RUN mv .env.production .env && npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
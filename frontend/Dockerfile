FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Build stage
FROM base as builder
# Copy package files first
COPY package.json package-lock.json ./
RUN npm ci
# Then copy the rest of the files
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
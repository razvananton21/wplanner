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
# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Create a directory for nginx to write runtime files
RUN mkdir -p /var/run/nginx && \
    mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/run/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html
# Switch to non-root user
USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
# Build stage
FROM node:18-alpine as builder
WORKDIR /build
# Copy only package files first
COPY package*.json ./
RUN npm ci
# Copy source files
COPY . .
# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy built files
COPY --from=builder /build/dist /usr/share/nginx/html
# Copy nginx config from host
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
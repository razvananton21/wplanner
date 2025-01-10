FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Add package files
COPY package*.json ./

# Development stage
FROM base as development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Build stage
FROM base as builder
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
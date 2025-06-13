# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and config files
COPY package.json package-lock.json* tailwind.config.js postcss.config.js ./

# Install dependencies including Tailwind CSS
RUN npm install

# Copy source code
COPY src/ ./src/
COPY public/ ./public/

# Build the app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Add nginx config for React SPA routing
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

# Create nginx config
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
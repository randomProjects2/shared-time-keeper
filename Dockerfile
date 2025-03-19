
# Use Node.js as the base image
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to replace environment variables at runtime
RUN echo "#!/bin/sh" > /docker-entrypoint.sh && \
    echo "envsubst '\$VITE_GOOGLE_CLIENT_ID' < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js" >> /docker-entrypoint.sh && \
    echo "nginx -g 'daemon off;'" >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Create env-config template
RUN echo "window.ENV = { VITE_GOOGLE_CLIENT_ID: '\${VITE_GOOGLE_CLIENT_ID}' };" > /usr/share/nginx/html/env-config.template.js

# Expose port 80
EXPOSE 80

# Start with our custom entrypoint script
CMD ["/docker-entrypoint.sh"]

### STAGE 1: Copy Build local ###
FROM node:20.9.0-alpine as builder
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
RUN npm cache clean --force
COPY . .
RUN npm install && npm run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/dist/t-pest-admin/browser .
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 to the outside once the container has launched.
EXPOSE 80
EXPOSE 443
# Start Nginx and keep it running in the foreground.
CMD ["nginx", "-g", "daemon off;"]
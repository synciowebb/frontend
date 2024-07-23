# FROM node:20-alpine3.17 AS builder

# WORKDIR /app

# COPY ./frontend/package.json package.json
# RUN npm install

# COPY ./frontend/ .

# RUN npm run build

# FROM nginx:alpine

# COPY --from=builder /app/dist/frontend /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]


FROM node:20-alpine3.17 AS build

# Set the working directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use the official Nginx image to serve the built application
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
#docker build -t chuthanh/dockerfile-fronted:latest -f Dockerfile .
#docker push chuthanh/dockerfile-fronted:latest
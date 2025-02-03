# Stage 1: Build the React application
FROM node:current-alpine3.20 AS build

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Install the dependencies
RUN pnpm install

# Copy the rest of the files
COPY . .

# Build the application
RUN pnpm run build

# Verificar la existencia de la carpeta 'dist' después del build
RUN ls -l /app/dist

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine

# Copy the built React application from the first stage
COPY --from=build /app/dist /usr/share/nginx/html

# Verificar que la carpeta 'dist' esté correctamente copiada
RUN ls -l /usr/share/nginx/html

# Expose port 5173 for the app
EXPOSE 5173

# Start Nginx and bind it to port 5173
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf", "-p", "5173"]

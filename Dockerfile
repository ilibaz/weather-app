# Use node image for building frontend
FROM node:18 AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend source code
COPY frontend ./

# Install dependencies and build frontend
RUN npm install
ENV NODE_ENV=production
RUN npm run build

# Use node image for running backend
FROM node:18 AS backend-builder

# Set working directory for backend
WORKDIR /app/backend

# Copy backend source code
COPY backend ./

# Install dependencies and build backend
RUN npm install
ENV NODE_ENV=production
RUN npm run build

# Create final image with only necessary files
FROM node:18

# Set working directory for final image
WORKDIR /app

# Copy built frontend and backend code from previous stages
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY backend/package.json backend/package-lock.json ./backend/

# Install production dependencies for backend
RUN cd backend && npm ci --silent --only=production

# Expose ports
EXPOSE 3001 5173

# Command to start both frontend and backend
CMD ["node", "backend/dist/server.js"]

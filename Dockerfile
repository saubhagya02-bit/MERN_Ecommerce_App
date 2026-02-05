# ---------- FRONTEND BUILD ----------
FROM node:18 AS frontend-build

WORKDIR /frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# ---------- BACKEND BUILD ----------
FROM node:18

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Copy frontend build into backend's public folder
# Adjust path if your backend serves static files from 'public' or 'client/build'
COPY --from=frontend-build /frontend/build ./public

# Expose backend port
EXPOSE 3000

# Start backend
CMD ["node", "server.js"]

# Use python as a base image
FROM python:3.10.7-slim as backend

# Set a working directory
WORKDIR /app

# Copy the backend requirements
COPY server/requirements.txt .

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-dev \
    ninja-build     

# Install backend dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY server/ .

# Build frontend
FROM node:16 as frontend

WORKDIR /app/frontend

# Copy the frontend dependencies
COPY package.json package-lock.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the frontend
RUN npm run build

# Copy built frontend to backend
FROM backend as final

COPY --from=frontend /app/frontend/build /app/static

CMD ["python", "new.py"]

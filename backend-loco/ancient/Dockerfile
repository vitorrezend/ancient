# Stage 1: Build the frontend
FROM node:20-slim AS frontend
WORKDIR /usr/src/app/frontend
COPY frontend/package.json ./
# Check for lock file and use ci if available
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY frontend/ .
RUN npm run build

# Stage 2: Build the backend
FROM rust:1.77-slim-bookworm AS builder
WORKDIR /usr/src/app

# Copy frontend build artifacts
COPY --from=frontend /usr/src/app/frontend/dist ./frontend/dist

# Copy dependencies manifest
COPY Cargo.toml Cargo.lock ./
# Copy migration folder, as it's a dependency
COPY migration ./migration

# Build dependencies
RUN mkdir -p src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release --locked

# Copy the rest of the source code
COPY . .

# Build the application binary
RUN cargo build --release --locked --bin ancient-cli

# Stage 3: Create the final, small image
FROM debian:bookworm-slim
WORKDIR /usr/src/app

# Copy the static assets for the frontend
COPY --from=builder /usr/src/app/frontend/dist ./frontend/dist

# Copy the configuration files
COPY --from=builder /usr/src/app/config ./config

# Copy the compiled binary
COPY --from=builder /usr/src/app/target/release/ancient-cli /usr/local/bin/

# Expose the port the app runs on
EXPOSE 5150

# Set environment variables to configure the server binding
# This ensures the app is accessible from outside the container
ENV LOCO_SERVER_PORT=5150
ENV LOCO_SERVER_BINDING="0.0.0.0"

# Set the command to run the application
CMD ["ancient-cli"]
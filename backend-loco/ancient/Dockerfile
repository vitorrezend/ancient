# Use a Rust image that includes the full toolchain
FROM rust:1.77-bookworm AS development

# Install loco-cli, which is needed for `cargo loco start`
RUN cargo install loco-cli

# Set the working directory
WORKDIR /usr/src/app

# Copy the application source code
COPY . .

# Expose the port the app runs on
EXPOSE 5150

# Set the command to run the application using loco-cli
# This will compile and run the app in development mode
CMD ["cargo", "loco", "start"]
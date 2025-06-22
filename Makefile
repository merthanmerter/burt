
.PHONY: help install dev build clean compile compile-all

# Default target
help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  dev         - Start development server"
	@echo "  build       - Build for production"
	@echo "  start       - Start the production server"
	@echo "  clean       - Clean build artifacts"
	@echo "  compile     - Compile for current platform"
	@echo "  run         - Run the compiled binary"

# Install dependencies
install:
	bun install

# Start development server
dev:
	bun run dev

# Build for production
build:
	bun run build

# Start the production server
start:
	bun run start

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf bin/
	rm -f db.sqlite

# Compile for current platform
compile:
	bun run compile

# Run the compiled binary
run:
	./bin/macos/index
	./bin/linux/index
	./bin/windows/index
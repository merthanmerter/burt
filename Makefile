
.PHONY: help install dev build clean compile run

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
	rm -rf public/
	rm -rf bin/
	rm -f db.sqlite

# Compile for current platform
compile:
	bun run compile

# Run the compiled binary
run:
	@case "$$(uname -s)" in \
		Darwin) \
			if [ "$$(uname -m)" = "arm64" ]; then ./bin/macos/index-arm64; else ./bin/macos/index; fi ;; \
		Linux) \
			./bin/linux/index ;; \
		MINGW*|MSYS*|CYGWIN*) \
			./bin/windows/index.exe ;; \
		*) \
			echo "Unsupported OS: $$(uname -s)" >&2; exit 1 ;; \
	esac

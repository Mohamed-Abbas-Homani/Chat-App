# Define the binary name and paths
BINARY_NAME=server
BINARY_PATH=bin/$(BINARY_NAME)
MAIN_PATH=cmd/chatapp/main.go

# Build the Go project
build:
	@go build -o $(BINARY_PATH) $(MAIN_PATH)

# Run the Go project
run: build
	@./$(BINARY_PATH)

# Run tests
test:
	@go test -v ./...

# Clean build artifacts
clean:
	@rm -f $(BINARY_PATH)

lint:
	cd back && golangci-lint run ./...

tidy:
	cd back && go mod tidy
lint:
	cd back && golangci-lint run ./...

tidy:
	cd back && go mod tidy

utest:
	cd back && go test ./... -v -count=1

itest:
	cd back && go test -tags=integration -v -count=1 ./tests/...
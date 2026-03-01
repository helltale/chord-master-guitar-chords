lint:
	cd back && golangci-lint run ./...

tidy:
	cd back && go mod tidy

test: utest itest

utest:
	cd back && go test ./... -v -count=1
	cd web && npm run test

itest:
	cd back && go test -tags=integration -v -count=1 ./tests/...

gen-back:
	cd back/internal/api && go generate .

gen-web:
	cd web && node scripts/gen-api-types.js
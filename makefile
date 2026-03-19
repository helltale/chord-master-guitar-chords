lint:
	cd back && golangci-lint run ./...
	cd web && npm run lint

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

docker-build:
	docker compose build --no-cache

restart:
	docker compose down -v && docker compose build && docker compose up -d

restart-srv:
	docker compose down && docker compose build && docker compose up -d

deploy-pull:
	docker compose -f docker-compose.prod.yml pull
	docker compose -f docker-compose.prod.yml up -d --remove-orphans


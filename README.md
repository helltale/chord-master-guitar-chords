# amdm-guitar-chords

тоже устали что amdm сайт постоянно блокают?
попробуем собрать аналог из говна и палок

<img width="960" height="471" alt="{807C6A74-6A22-4C65-98AA-DE3D02637CD3}" src="https://github.com/user-attachments/assets/c3fc0e26-589a-4e89-aa17-b92affb4b237" />

для локального запуска наберите 'make restart' из корня проекта (chord-master-guitar-chords/$)

## Бэкапы PostgreSQL

В compose добавлен отдельный сервис `db-backup`, который периодически делает дамп БД в `backups/` и хранит только последние N файлов (FIFO).

- ручной бэкап: `make backup`
- ручное восстановление: `make restore BACKUP_FILE=backups/<file>.sql.gz`
- автозапуск в фоне: `docker compose up -d db-backup`

Основные переменные для автосервиса:

- `BACKUP_INTERVAL_SEC` — интервал между бэкапами (по умолчанию `21600`, то есть 6 часов)
- `BACKUP_KEEP` — сколько последних бэкапов хранить (по умолчанию `10`)
- `BACKUP_WAIT_TIMEOUT_SEC` — сколько ждать успешный preflight БД/health (по умолчанию `60`)
- `BACKUP_CHECK_BACKEND_HEALTH` — включить проверку `GET /healthz` у backend (`false` по умолчанию)
- `BACKEND_HEALTH_URL` — URL health endpoint backend (по умолчанию `http://back:8081/healthz`)

Перед каждым дампом сервис проверяет:

1. `pg_isready` + `SELECT 1` к PostgreSQL
2. (опционально) `GET /healthz` у backend

Это снижает риск создания бэкапа в момент нездорового состояния приложения.

Важно: локальная FIFO-ротация на том же сервере не заменяет off-site хранение. Рекомендуется периодически копировать `backups/` во внешнее хранилище (например S3 или второй хост).

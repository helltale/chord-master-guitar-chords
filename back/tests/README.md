# Интеграционные тесты API

## Требования и запуск

- **По умолчанию** тесты сами поднимают **PostgreSQL в Docker** (testcontainers), прогоняют тесты и **полностью удаляют контейнер** после завершения. Нужен запущенный Docker (docker socket доступен тестам).
- **Запуск** из корня `back`:
  ```bash
  go test -tags=integration -v ./tests/...
  ```
  Без тега `integration` тесты в пакете `tests` не попадают в сборку.

**Вариант без Docker (своя БД):** задайте переменную окружения `TEST_DATABASE_DSN` (полная строка подключения к PostgreSQL, например `postgres://amdm:amdm@localhost:5432/amdm_test?sslmode=disable`). Тогда контейнер не создаётся, тесты подключаются к указанной БД. Удобно для CI с уже поднятой БД или для отладки.

## Какие тесты что проверяют

### Artists (`artists_integration_test.go`)

| Тест | Что проверяет |
|------|----------------|
| **TestArtists_ListEmpty** | `GET /artists` на пустой БД возвращает `200`, `items: []`, `total: 0`. |
| **TestArtists_CreateSuccess** | `POST /artists` с валидными `name` и `slug` → `201`, в теле есть `artist_id`, `name`, `slug`; затем `GET /artists/{slug}` возвращает того же артиста (`200`), в т.ч. поле `songs` (массив). |
| **TestArtists_CreateDuplicateSlug_Returns400** | Первый `POST /artists` с `slug` → `201`; второй с тем же `slug` → `400`. |
| **TestArtists_CreateValidation_Returns400** | `POST /artists` с пустым `name`, пустым `slug` или невалидным `slug` (пробелы/спецсимволы) → `400` (подтесты: empty_name, empty_slug, invalid_slug). |
| **TestArtists_GetBySlug_NotFound_Returns404** | `GET /artists/non-existent-slug-12345` → `404`. |
| **TestArtists_ListPagination** | Создаются 3 артиста (Charlie, Alice, Bob); `GET /artists?limit=2&offset=1` → `200`, порядок по `name`, в `items` ровно 2 элемента (Bob, Charlie), `total` ≥ 3. |

### Songs (`songs_integration_test.go`)

| Тест | Что проверяет |
|------|----------------|
| **TestSongs_CreateSuccess** | Создание артиста через API, затем `POST /songs` с валидным `artist_id`, `title`, `slug` → `201`, в ответе `song_id`, `artist_id`, `title`, `slug`, `tonality`; `GET /songs/{id}` возвращает те же данные. |
| **TestSongs_CreateDuplicateSlug_Returns400** | У одного артиста создаётся песня с `slug`; вторая песня с тем же `slug` у того же артиста → `400`. |
| **TestSongs_CreateValidation_Returns400** | `POST /songs` с пустым `title`, пустым `slug` или невалидным `slug` → `400` (подтесты: empty_title, empty_slug, invalid_slug). |
| **TestSongs_Get_NotFound_Returns404** | `GET /songs/11111111-1111-1111-1111-111111111111` (валидный UUID, записи нет) → `404`. |
| **TestSongs_ListByArtistId** | Создаётся артист и одна песня; `GET /songs?artist_id={id}` → `200`, `total: 1`, в `items` одна песня с ожидаемым `title`. |
| **TestSongs_UpdateSuccess** | Создаётся артист и песня; `PUT /songs/{id}` с новыми `title` и `slug` → `200`, в ответе обновлённые поля; `GET /songs/{id}` возвращает те же обновлённые данные. |
| **TestSongs_Update_NotFound_Returns404** | `PUT /songs/11111111-1111-1111-1111-111111111111` с телом → `404`. |
| **TestSongs_TransposeSuccess** | Создаётся песня с `content` (аккорды C, G) и `tonality: 0`; `POST /songs/{id}/transpose?semitones=2` → `200`, в ответе `tonality: 2` и в `content.sections` аккорды сдвинуты (D, A). |
| **TestSongs_Transpose_NotFound_Returns404** | `POST /songs/11111111-1111-1111-1111-111111111111/transpose?semitones=1` → `404`. |

### Search (`search_integration_test.go`)

| Тест | Что проверяет |
|------|----------------|
| **TestSearch_EmptyQuery_ReturnsEmpty** | `GET /search?q=%20` (пробел) → `200`, `items: []`, `total: 0` (пустой запрос не дергает поиск по БД). |
| **TestSearch_BySongTitle** | Создаётся артист и песня с уникальным title; `GET /search?q=UniqueTitleForSearch` → `200`, в `items` есть песня с подстрокой в title, `total` ≥ 1. |
| **TestSearch_ByArtistName** | Создаётся артист "BandForSearch" и песня "Any Song"; поиск `q=BandForSearch` → в результатах есть "Any Song", `total` ≥ 1. |
| **TestSearch_Pagination** | Создаётся артист и 5 песен (PageSongA–E); `GET /search?q=PageSong&limit=2&offset=1` → `200`, `total` ≥ 5, в `items` ровно 2 элемента. |

---

## Структура тестов

- **`setup_test.go`** — `TestMain`: при отсутствии `TEST_DATABASE_DSN` поднимает контейнер PostgreSQL (postgres:16-alpine) через testcontainers, выставляет DSN в env, по завершении тестов останавливает и удаляет контейнер. Там же: `NewTestServer`, `openTestDB`, подключение к БД (из env или config), миграции, создание `*httptest.Server` с chi + handler, базовый URL `/api`. Логирование GORM в тестах отключено (`logger.Silent`): проверка «такой slug уже есть?» перед созданием и запросы к несуществующим id/slug дают «record not found» — это ожидаемое поведение, а не ошибка теста; тесты проверяют запись в БД через GET после Create/Update и проверку полей ответа.
- **`artists_integration_test.go`** — табличные и отдельные тесты по сценариям Artists.
- **`songs_integration_test.go`** — сценарии Songs (Create, Get, List, Update, Transpose).
- **`search_integration_test.go`** — сценарии Search.

В каждом файле: подготовка данных через API или напрямую в БД (где удобнее), вызов HTTP, проверка статуса и при необходимости распарсенного JSON (id, slug, total, поля content и т.д.).

#!/bin/sh
# Prune old rows from song_opens so the table does not grow without bound.
#
# The API ranks by opens in the last 30 days. Keep rows newer than (30 + margin)
# days; older events no longer affect that metric.
#
# Modes:
# - One-shot (default): run once and exit — for host cron or manual runs.
# - Daemon: set PRUNE_INTERVAL_SEC>0 — waits for PostgreSQL, prunes, sleeps,
#   repeats (use in Docker alongside db-backup).
#
# Do NOT run TRUNCATE on the 1st of each month unless the product is explicitly
# "popularity this calendar month" — that would reset rolling 30-day stats.
#
# Expects PostgreSQL env: PGHOST, PGPORT, PGUSER, PGDATABASE, PGPASSWORD or ~/.pgpass.

set -eu

# Delete opens strictly older than this many days (must be > 30 so the API window stays valid).
KEEP_DAYS="${KEEP_DAYS:-45}"

# Set to 1 to only print how many rows would be deleted, without deleting (one-shot only).
DRY_RUN="${DRY_RUN:-0}"

# When set to a positive number of seconds, run forever: wait for DB, prune, sleep, repeat.
PRUNE_INTERVAL_SEC="${PRUNE_INTERVAL_SEC:-}"

PRUNE_WAIT_TIMEOUT_SEC="${PRUNE_WAIT_TIMEOUT_SEC:-60}"

log() {
  printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"
}

require_env() {
  for v in PGHOST PGPORT PGUSER PGDATABASE; do
    eval "x=\${$v:-}"
    if [ -z "$x" ]; then
      log "error: $v is not set"
      exit 1
    fi
  done
}

validate_keep_days() {
  if ! echo "$KEEP_DAYS" | grep -Eq '^[0-9]+$'; then
    log "error: KEEP_DAYS must be a non-negative integer, got: ${KEEP_DAYS}"
    exit 1
  fi
  if [ "$KEEP_DAYS" -le 30 ]; then
    log "error: KEEP_DAYS must be greater than 30 (API uses a 30-day window)"
    exit 1
  fi
}

validate_prune_interval() {
  if [ -z "${PRUNE_INTERVAL_SEC:-}" ]; then
    return 1
  fi
  if ! echo "$PRUNE_INTERVAL_SEC" | grep -Eq '^[0-9]+$' || [ "$PRUNE_INTERVAL_SEC" -le 0 ]; then
    log "error: PRUNE_INTERVAL_SEC must be a positive integer, got: ${PRUNE_INTERVAL_SEC}"
    exit 1
  fi
  return 0
}

wait_for_db() {
  start="$(date +%s)"
  while true; do
    if pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" >/dev/null 2>&1 \
      && psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -tAc 'SELECT 1' >/dev/null 2>&1; then
      return 0
    fi
    now="$(date +%s)"
    if [ $((now - start)) -ge "$PRUNE_WAIT_TIMEOUT_SEC" ]; then
      log "db preflight timeout after ${PRUNE_WAIT_TIMEOUT_SEC}s"
      return 1
    fi
    sleep 2
  done
}

prune_once() {
  threshold="NOW() - INTERVAL '${KEEP_DAYS} days'"

  if [ "$DRY_RUN" = "1" ]; then
    cnt="$(
      psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -tAc \
        "SELECT COUNT(*) FROM song_opens WHERE opened_at < ${threshold};"
    )"
    log "dry-run: would delete ${cnt} row(s) (opened_at older than ${KEEP_DAYS} days)"
    return 0
  fi

  if ! deleted="$(
    psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 -tAc \
      "WITH d AS (
         DELETE FROM song_opens
         WHERE opened_at < ${threshold}
         RETURNING 1
       )
       SELECT COUNT(*)::text FROM d;"
  )"; then
    return 1
  fi
  log "prune complete: deleted ${deleted} row(s) (cutoff: ${KEEP_DAYS} days)"
  return 0
}

run_daemon() {
  if [ "$DRY_RUN" = "1" ]; then
    log "error: DRY_RUN=1 is not supported in daemon mode"
    exit 1
  fi
  require_env
  validate_keep_days
  log "song-opens-prune runner started (interval=${PRUNE_INTERVAL_SEC}s, keep_days=${KEEP_DAYS})"

  while true; do
    if wait_for_db; then
      if ! prune_once; then
        log "prune cycle failed, will retry after interval"
      fi
    else
      log "db unavailable, will retry after interval"
    fi
    sleep "$PRUNE_INTERVAL_SEC"
  done
}

run_once() {
  require_env
  validate_keep_days
  prune_once
}

main() {
  if validate_prune_interval; then
    run_daemon
  else
    run_once
  fi
}

main "$@"

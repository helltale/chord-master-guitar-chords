#!/bin/sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-/backups}"
BACKUP_INTERVAL_SEC="${BACKUP_INTERVAL_SEC:-21600}"
BACKUP_KEEP="${BACKUP_KEEP:-10}"
BACKUP_WAIT_TIMEOUT_SEC="${BACKUP_WAIT_TIMEOUT_SEC:-60}"
BACKUP_CHECK_BACKEND_HEALTH="${BACKUP_CHECK_BACKEND_HEALTH:-false}"
BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-http://back:8081/healthz}"

log() {
  printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"
}

wait_for_db() {
  start="$(date +%s)"
  while true; do
    if pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" >/dev/null 2>&1 \
      && psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -tAc 'SELECT 1' >/dev/null 2>&1; then
      return 0
    fi
    now="$(date +%s)"
    if [ $((now - start)) -ge "$BACKUP_WAIT_TIMEOUT_SEC" ]; then
      log "db preflight timeout after ${BACKUP_WAIT_TIMEOUT_SEC}s"
      return 1
    fi
    sleep 2
  done
}

wait_for_backend_health() {
  if [ "$BACKUP_CHECK_BACKEND_HEALTH" != "true" ]; then
    return 0
  fi
  start="$(date +%s)"
  while true; do
    if wget -q -T 5 -O - "$BACKEND_HEALTH_URL" >/dev/null 2>&1; then
      return 0
    fi
    now="$(date +%s)"
    if [ $((now - start)) -ge "$BACKUP_WAIT_TIMEOUT_SEC" ]; then
      log "backend health preflight timeout after ${BACKUP_WAIT_TIMEOUT_SEC}s"
      return 1
    fi
    sleep 2
  done
}

create_backup() {
  timestamp="$(date +%Y%m%d_%H%M%S)"
  final_file="${BACKUP_DIR}/postgres_${timestamp}.sql.gz"
  tmp_file="${final_file}.tmp"

  if ! pg_dump -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" --clean --if-exists --no-owner --no-privileges | gzip >"$tmp_file"; then
    rm -f "$tmp_file"
    return 1
  fi

  mv "$tmp_file" "$final_file"
  log "backup created: ${final_file}"
}

rotate_backups() {
  count="$(ls -1 "${BACKUP_DIR}"/postgres_*.sql.gz 2>/dev/null | wc -l | tr -d ' ')"
  if [ "$count" -le "$BACKUP_KEEP" ]; then
    return 0
  fi

  remove_count=$((count - BACKUP_KEEP))
  ls -1 "${BACKUP_DIR}"/postgres_*.sql.gz | sort | head -n "$remove_count" | while IFS= read -r file; do
    rm -f "$file"
    log "backup removed: ${file}"
  done
}

main() {
  mkdir -p "$BACKUP_DIR"
  log "db-backup runner started (interval=${BACKUP_INTERVAL_SEC}s, keep=${BACKUP_KEEP})"

  while true; do
    if wait_for_db && wait_for_backend_health && create_backup; then
      rotate_backups
    else
      log "backup cycle failed, retrying after interval"
    fi
    sleep "$BACKUP_INTERVAL_SEC"
  done
}

main

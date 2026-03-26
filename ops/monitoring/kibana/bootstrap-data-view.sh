#!/bin/sh

set -eu

KIBANA_URL="${KIBANA_URL:-http://kibana:5601}"
DATA_VIEW_TITLE="${KIBANA_DATA_VIEW_TITLE:-logs-amdm-*}"
DATA_VIEW_NAME="${KIBANA_DATA_VIEW_NAME:-AMDM Logs}"
TIME_FIELD="${KIBANA_TIME_FIELD:-@timestamp}"

echo "kibana-setup: waiting for Kibana at ${KIBANA_URL}"
until curl -fsS "${KIBANA_URL}/api/status" >/dev/null 2>&1; do
  sleep 2
done

echo "kibana-setup: Kibana is reachable, creating data view"
create_response="$(
  curl -fsS -X POST "${KIBANA_URL}/api/data_views/data_view" \
    -H "Content-Type: application/json" \
    -H "kbn-xsrf: true" \
    -d "{
      \"data_view\": {
        \"title\": \"${DATA_VIEW_TITLE}\",
        \"name\": \"${DATA_VIEW_NAME}\",
        \"timeFieldName\": \"${TIME_FIELD}\"
      },
      \"override\": true
    }"
)"

data_view_id="$(
  printf '%s' "${create_response}" \
    | sed -n 's/.*"id":"\([^"]*\)".*/\1/p' \
    | head -n 1
)"

if [ -z "${data_view_id}" ] || ! [[ "${data_view_id}" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$ ]]; then
  echo "kibana-setup: failed to parse data view id"
  exit 1
fi

echo "kibana-setup: setting default data view (${data_view_id})"
curl -fsS -X POST "${KIBANA_URL}/api/data_views/default" \
  -H "Content-Type: application/json" \
  -H "kbn-xsrf: true" \
  -d "{\"data_view_id\":\"${data_view_id}\",\"force\":true}" >/dev/null

echo "kibana-setup: done"

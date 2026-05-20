#!/usr/bin/env bash
# Ping IndexNow for one or more URLs so Bing (and partners) re-crawl immediately.
# Usage: ./bin/indexnow.sh                    # pings the homepage
#        ./bin/indexnow.sh /projects/talkative/ /projects/getdirect/
set -euo pipefail

HOST="vijaykarn.com.np"
KEY="87ade994724c485b435de6d32bfb38d8"
KEY_LOCATION="https://${HOST}/${KEY}.txt"

# Default to homepage if no URLs passed
if [ "$#" -eq 0 ]; then
  set -- "/"
fi

# Build JSON array of full URLs
urls_json=$(printf '"https://%s%s",' "$HOST" "$@" | sed 's/,$//')

payload=$(cat <<JSON
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": [${urls_json}]
}
JSON
)

echo "Pinging IndexNow for:" "$@"
curl -fsS -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "${payload}" \
  && echo "OK" \
  || echo "Failed"

#!/bin/bash

set -e

BASE_URL="https://host.docker.internal:9200"
USER="dennis"
PASS="demo"

ping host.docker.internal

echo "Create load-test.txt"
curl -k -X PUT "$BASE_URL/dav/files/$USER/load-test.txt" -u "$USER:$PASS" --data-binary "Hello, World!" > /dev/null

echo "Get file id and drive id"
read FILE_ID DRIVE_ID < <(
  curl -k "$BASE_URL/graph/v1.0/me/drive/root/children" -u "$USER:$PASS" \
  | jq -r '.value[] 
    | select(.name=="load-test.txt") 
    | "\(.id) \(.parentReference.driveId)"'
)

echo "File ID: $FILE_ID"
echo "Drive ID: $DRIVE_ID"

SHARE_URL=$(curl -k -X POST -s \
  "$BASE_URL/graph/v1beta1/drives/$DRIVE_ID/items/$FILE_ID/createLink" \
  -u "$USER:$PASS" \
  -H "Content-Type: application/json" \
  -d '{"type":"view"}' \
  | jq -r '.link.webUrl')

echo $SHARE_URL
echo "SHARE_URL=$SHARE_URL" >> $GITHUB_ENV
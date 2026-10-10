#!/bin/bash
# Spustí ADREMA na http://localhost:8000 a otvorí ju v prehliadači
cd "$(dirname "$0")" || exit 1
PORT=8000
while lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT+1)); done
echo "ADREMA beží na http://localhost:$PORT  (zastavíš zatvorením tohto okna alebo Ctrl+C)"
(sleep 1; open "http://localhost:$PORT/") &
python3 -m http.server "$PORT"

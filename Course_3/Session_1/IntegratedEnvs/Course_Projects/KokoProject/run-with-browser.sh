#!/usr/bin/env bash

set -e

docker compose up --build -d

sleep 10

# Detect OS and open URLs accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:8081" &
    open "http://localhost:8080/scalar" &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:8081" &
    xdg-open "http://localhost:8080/scalar" &
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash, Cygwin, or WSL)
    if command -v cmd.exe &> /dev/null; then
        cmd.exe /c start "http://localhost:8081"
        cmd.exe /c start "http://localhost:8080/scalar"
    elif command -v explorer.exe &> /dev/null; then
        explorer.exe "http://localhost:8081"
        explorer.exe "http://localhost:8080/scalar"
    else
        echo "Could not find a way to open browser on Windows. Please open manually:"
        echo "  http://localhost:8081"
        echo "  http://localhost:8080/scalar"
    fi
else
    echo "Unknown OS. Please open manually:"
    echo "  http://localhost:8081"
    echo "  http://localhost:8080/scalar"
fi

docker compose logs -f



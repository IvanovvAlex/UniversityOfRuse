@echo off
setlocal

docker compose up --build -d

timeout /t 10 /nobreak >nul

start "" "http://localhost:8081"
start "" "http://localhost:8080/scalar"

docker compose logs -f


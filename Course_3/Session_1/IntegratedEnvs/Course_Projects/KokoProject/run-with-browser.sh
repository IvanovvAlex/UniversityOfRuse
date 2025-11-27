#!/usr/bin/env bash

set -e

docker compose up --build -d

sleep 10

open "http://localhost:8081" &
open "http://localhost:8080/scalar" &

docker compose logs -f



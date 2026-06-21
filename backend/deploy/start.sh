#!/usr/bin/env sh
set -eu

DB_FILE="${DB_DATABASE:-/app/database/database.sqlite}"
DB_DIR="$(dirname "$DB_FILE")"

mkdir -p "$DB_DIR" storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
touch "$DB_FILE"

php artisan migrate --force --seed
php artisan config:cache

php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"

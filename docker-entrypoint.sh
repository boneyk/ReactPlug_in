#!/bin/sh

echo "Injecting runtime env variables..."

sed -i "s|__AUTH_BASE_URL__|${AUTH_BASE_URL:-}|g" /usr/share/nginx/html/env.js
sed -i "s|__EMPLOYEE_BASE_URL__|${EMPLOYEE_BASE_URL:-}|g" /usr/share/nginx/html/env.js
sed -i "s|__SCHEDULE_BASE_URL__|${SCHEDULE_BASE_URL:-}|g" /usr/share/nginx/html/env.js


exec nginx -g "daemon off;"

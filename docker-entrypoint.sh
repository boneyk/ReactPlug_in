echo "Injecting runtime env variables..."

sed -i "s|__BASE_URL__|${BASE_URL:-}|g" /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"

location /static/ {
  rewrite ^/static/(.*)$ /public/$1;
}

location /cdn {
  root /srv/{{server_domain}}/x-platform/public;
  gzip on;
  gzip_types text/plain application/x-javascript application/javascript text/css application/octet-stream;

  expires 365d;
}

location /public {
  root /srv/{{server_domain}}/x-platform;
  gzip on;
  gzip_types text/plain application/x-javascript application/javascript text/css application/octet-stream;

  expires 3d;
}

include xpla/{{server_domain}}.services;

location /api/recordings {
  proxy_cache {{server_short}}two;
  proxy_cache_valid 200 600m;
  add_header X-Cache-Status $upstream_cache_status;

  proxy_pass  https://xpla_{{server_short}};
  proxy_set_header Host      $host;
  proxy_set_header X-Real-IP $remote_addr;
}

location /api/page {
  proxy_cache {{server_short}}two;
  proxy_cache_valid 200 60m;
  proxy_cache_min_uses 2;
  add_header X-Cache-Status $upstream_cache_status;

  proxy_pass  https://xpla_{{server_short}};
  proxy_set_header Host      $host;
  proxy_set_header X-Real-IP $remote_addr;
}

location / {
  proxy_pass  https://xpla_{{server_short}};
  proxy_set_header Host      $host;
  proxy_set_header X-Real-IP $remote_addr;

  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_read_timeout 86400;
}

{% if live_port is defined %}
location /live {
  proxy_pass http://localhost:{{live_port}};
  proxy_set_header Host      $host;
  proxy_set_header X-Real-IP $remote_addr;

  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_read_timeout 86400;
}
{% endif %}

error_page 502 /offline.html;

location = /offline.html {
  root /srv/{{server_domain}}/x-platform;
}


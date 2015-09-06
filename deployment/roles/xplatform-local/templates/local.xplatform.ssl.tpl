
server {
  listen 80;
  server_name local.{{server_domain}};

  location /cdn {
    root /srv/{{server_domain}}/x-platform/public;
    gzip on;
    gzip_types text/plain application/x-javascript application/javascript text/css application/octet-stream;

    expires 365d;
  }

  return 301 https://{{server_domain}}$request_uri;
}

server {
  listen  443 ssl spdy; 
  server_name local.{{server_domain}};

  ssl on;
  ssl_certificate /etc/nginx/xpla/keys/local.{{server_domain}}.crt;
  ssl_certificate_key /etc/nginx/xpla/keys/local.{{server_domain}}.key;

  location / {
    resolver 8.8.8.8;
    proxy_pass https://{{server_domain}};
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;
  }

  location /cdn {
    root /srv/{{server_domain}}/x-platform/public;
    gzip on;
    gzip_types text/plain application/x-javascript application/javascript text/css application/octet-stream;

    expires 365d;
  }

  location /nginx_status {
# copied from http://blog.kovyrin.net/2006/04/29/monitoring-nginx-with-rrdtool/
    stub_status on;
    access_log   off;
  }
}

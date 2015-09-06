
server {
  listen 80;
  server_name local.{{server_domain}};

  location /cdn {
    root /srv/{{server_domain}}/x-platform/public;
    gzip on;
    gzip_types text/plain application/x-javascript application/javascript text/css application/octet-stream;
  
    add_header Access-Control-Allow-Origin *;

    expires 365d;
  }

  location / {
    return 301 https://{{server_domain}}$request_uri;
  }
}

server {
  listen  443 ssl spdy; 
  server_name local.{{server_domain}};

  ssl on;
  ssl_certificate /etc/nginx/xpla/keys/local.{{server_domain}}.crt;
  ssl_certificate_key /etc/nginx/xpla/keys/local.{{server_domain}}.key;

  location /cdn {
    root /srv/{{server_domain}}/x-platform/public;
    gzip on;
    gzip_types text/plain application/x-javascript application/javascript text/css application/octet-stream;

    add_header Access-Control-Allow-Origin *;

    expires 365d;
  }

  location /nginx_status {
# copied from http://blog.kovyrin.net/2006/04/29/monitoring-nginx-with-rrdtool/
    stub_status on;
    access_log   off;
  }

  location / {
    return 301 https://{{server_domain}}$request_uri;
  }
}

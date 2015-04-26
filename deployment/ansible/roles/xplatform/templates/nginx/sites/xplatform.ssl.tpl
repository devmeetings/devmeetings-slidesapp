##
# Proxy Caching
##
proxy_cache_path /var/cache/nginx/{{server_domain}}/one keys_zone={{server_short}}one:20m;
proxy_cache_path /var/cache/nginx/{{server_domain}}/two keys_zone={{server_short}}two:50m;


server {
  listen 80;
  server_name {{server_domain}} www.{{server_domain}} *.{{server_domain}};

  location / {
    rewrite ^ https://$server_name$request_uri? permanent;
  }
}

server {
  listen  443 ssl spdy; 
  server_name {{server_domain}} *.{{server_domain}};

  ssl on;
  ssl_certificate /etc/nginx/xpla/keys/ssl-unified.crt;
  ssl_certificate_key /etc/nginx/xpla/keys/ssl.key;

  include xpla/{{server_domain}}.config;

  location /nginx_status {
# copied from http://blog.kovyrin.net/2006/04/29/monitoring-nginx-with-rrdtool/
    stub_status on;
    access_log   off;
  }
}


##
# Proxy Caching
##
proxy_cache_path /var/cache/nginx/{{server_domain}}/one keys_zone={{server_short}}one:20m;
proxy_cache_path /var/cache/nginx/{{server_domain}}/two keys_zone={{server_short}}two:50m;

upstream xpla_{{server_short}} {
  ip_hash;

  {% for n in range(server_cluster) %}
  server localhost:{{server_port + n}};
  {% endfor %}

  keepalive 32;
}
upstream xpla_livereload_{{server_short}} {
  ip_hash;

  {% for n in range(server_cluster) %}
  server localhost:{{livereload_port + n}};
  {% endfor %}

  keepalive 32;
}

server {
  listen 80;
  server_name unsafe.{{server_domain}};

  include xpla/{{server_domain}}.config;
}

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
  ssl_certificate /etc/nginx/xpla/keys/{{server_domain}}.crt;
  ssl_certificate_key /etc/nginx/xpla/keys/{{server_domain}}.key;

  include xpla/{{server_domain}}.config;

  location /nginx_status {
# copied from http://blog.kovyrin.net/2006/04/29/monitoring-nginx-with-rrdtool/
    stub_status on;
    access_log   off;
  }
}

server {
  listen 35728;
  server_name {{server_domain}} *.{{server_domain}};

  ssl on;
  ssl_certificate /etc/nginx/xpla/keys/{{server_domain}}.crt;
  ssl_certificate_key /etc/nginx/xpla/keys/{{server_domain}}.key;

  location / {
    proxy_pass http://xpla_livereload_{{server_short}};
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;
  } 
}

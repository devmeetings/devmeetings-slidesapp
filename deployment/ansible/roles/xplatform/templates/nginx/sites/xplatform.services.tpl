location /ext/convert {
  proxy_cache {{server_short}}one;
  proxy_cache_valid 200 60m;
  add_header X-Cache-Status $upstream_cache_status;

  proxy_ignore_headers "Cache-Control";
  proxy_pass http://rate-exchange.appspot.com/currency;
  proxy_set_header Host rate-exchange.appspot.com;
  proxy_set_header X-Real-IP $remote_addr;
}

location /ext/github/ {
  proxy_cache {{server_short}}one;
  proxy_cache_valid 200 60m; 
  add_header X-Cache-Status $upstream_cache_status;

  proxy_ignore_headers "Cache-Control";
  proxy_pass https://api.github.com/;
  proxy_set_header X-Real-IP $remote_addr;
  add_header User-Agent xplatform;
}

location /ext/soundcloud/tracks.json {
  proxy_cache {{server_short}}one;
  proxy_cache_valid 200 60m;
  add_header X-Cache-Status $upstream_cache_status;
  proxy_ignore_headers "Cache-Control";

  resolver 8.8.8.8;
# TODO [ToDr] This is Wkwiatek's client_id
  proxy_pass http://api.soundcloud.com/tracks.json?client_id=288c3b51bc9cfb269d1a89d92e4196a3&$args;
  proxy_set_header X-Real-IP $remote_addr;
}

location /ext/lorempixel/ {
  proxy_cache {{server_short}}one;
  proxy_cache_valid 200 60m;
  add_header X-Cache-Status $upstream_cache_status;

  proxy_pass http://lorempixel.com/;
  proxy_set_header REFERER "http://xplatform.org";
}

location /ext/requestbin {
  proxy_pass http://requestb.in/;
  proxy_set_header Host      $host;
  proxy_set_header X-Real-IP $remote_addr;
}



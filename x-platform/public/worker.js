/* globals self,fetch,caches,URL,Request,importScripts */

importScripts('/static/serviceworker-cache-polyfill.js');

var CACHE_VERSION = 1;
var CACHE_NAME = 'xpla-cache';
var CACHE = CACHE_NAME + '-v' + CACHE_VERSION;

var LOCAL_DOMAIN = 'local.xplatform.org';
var LOCAL_CHECK = 'https://' + LOCAL_DOMAIN + '/isLocal';
var LOCAL_CHECK_INTERVAL = 60000;

var isLocalActive = false;
var isLocalLastTry = null;

var isCdn = /\/cdn\//;
var isStatic = /\/static\//;
var isRecording = /\/api\/recordings\//;
var isApi = /\/api\//;
var isDevCode = /(\/static\/dm)|(\/api\/recordings)|(\/static\/bin)/;

var INITIAL_CACHE = [
  '/static/fonts/opensans/woff/OpenSans-Light.woff',
  '/static/fonts/opensans/woff/OpenSans-Semibold.woff',
  '/static/images/navbar/xplatform_logo.png',
  '/static/jspm_packages/system.js',
  '/static/jspm_packages/es6-module-loader.js',
  '/static/jspm.config.js',
  '/'
];

var INITIAL_NON_CRITICAL_CACHE = [
  '/static/bin/dm-xplatform-' + CACHE_VERSION + '.js',
  '/static/bin/style-' + CACHE_VERSION + '.css'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      cache.addAll(INITIAL_NON_CRITICAL_CACHE);
      return cache.addAll(INITIAL_CACHE);
    }).catch(function (err) {
      console.warn('Unable to cache initial stuff', err);
      throw err;
    })
  );
});

self.addEventListener('activate', function (event) {
  // Clear old caches
  caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cacheName) {
        // Dont' remove other caches
        if (cacheName.indexOf(CACHE_NAME) === -1) {
          return;
        }

        // Don't remove current cache
        if (cacheName === CACHE) {
          return;
        }

        // Remove old version
        return caches.delete(cacheName);
      })
    );
  });
});

self.addEventListener('fetch', function (event) {
  var url = event.request.url;

  if (!isLocalActive) {
    if (
      !isCdn.test(url) &&
      !isStatic.test(url) &&
      !isApi.test(url)
    ) {
      // This is just a page refresh - check if local is active
      return event.respondWith(
        detectLocalXplatform(url).then(function () {
          return cachedResponseIfNeeded(event.request);
        })
      );
    }

    return event.respondWith(
      cachedResponseIfNeeded(event.request)
    );
  }

  // Redirect to local server
  if (
    isCdn.test(url) ||
    isStatic.test(url) ||
    isRecording.test(url)
  ) {
    return event.respondWith(
      redirectToLocalAndCache(event.request)
    );
  }

  // Just fetch
  return event.respondWith(
    fetch(event.request)
  );
});

function detectLocalXplatform (url) {
  // If we recently checked for local - do nothing
  var now = Date.now();
  if (isLocalLastTry && now - isLocalLastTry < LOCAL_CHECK_INTERVAL) {
    return Promise.resolve();
  }

  console.log('Detecting local.xplatform when accessing', url);
  // Try to check for local
  isLocalLastTry = now;
  return fetch(LOCAL_CHECK).then(function () {
    console.log('Detected local.xplatform');
    isLocalActive = true;
  }).catch(function (err) {
    console.warn('Unable to detect local.xplatform.', err);
  });
}

function redirectToLocalAndCache (request) {
  var url = new URL(request.url);
  url.hostname = LOCAL_DOMAIN;
  url.port = '';

  var newRequest = new Request(request, {
    url: url.toString()
  });

  return cachedResponseIfNeeded(newRequest).catch(function (err) {
    // If there is error with local response - disable local cache
    console.warn('Error getting response from local.xplatform. Falling back to normal server', err);
    isLocalActive = false;
    // And try again with original request
    return fetch(request.clone());
  });
}

function cachedResponseIfNeeded (request) {
  if (isCdn.test(request.url)) {
    return cachedResponse(request);
  }

  if (isStatic.test(request.url)) {
    return cachedResponse(request);
  }

  // Don't cache - just return the thing
  return fetch(request);
}

function cachedResponse (request) {
  return caches.match(request).then(function (response) {
    if (response) {
      return response;
    }

    return fetch(request).then(function (response) {
      // Don't cache errors
      if (response.status >= 400) {
        return response;
      }

      // Don't cache when doing local development
      if (CACHE_VERSION === 0 && isDevCode.test(request.url)) {
        return response;
      }

      var responseToCache = response.clone();
      console.log('Caching the response to', request.url);
      caches.open(CACHE).then(function (cache) {
        cache.put(request, responseToCache).catch(function (err) {
          console.warn('Unable to put response to cache', err);
        });
      });

      return response;
    });
  });
}

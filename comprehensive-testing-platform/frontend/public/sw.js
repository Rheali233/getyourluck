// Service Worker for caching static assets
const STATIC_CACHE = 'static-v1.3';
const DYNAMIC_CACHE = 'dynamic-v1.3';

// 需要缓存的静态资源（仅核心HTML）
// ⚠️ 注意：图片和其他资源从CDN加载，不需要缓存
const STATIC_ASSETS = [
  '/',
  '/index.html'
];

// 需要缓存的API路径模式 - 暂时禁用API缓存
const API_CACHE_PATTERNS = [
  // '/api/test-types',
  // '/api/psychology/questions',
  // '/api/blog/articles'
];

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch(() => {
        // Silent fail for production
      })
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理GET请求
  if (request.method !== 'GET') {
    return;
  }

  // 🔥 关键修复：不拦截外部CDN和API请求
  // 只处理同域名的请求
  if (url.origin !== self.location.origin) {
    return; // 让浏览器直接处理外部请求
  }

  // 🔥 不拦截API请求（会被_redirects代理到backend）
  if (url.pathname.startsWith('/api/')) {
    return; // 让浏览器和_redirects处理API请求
  }

  // 🔥 不拦截静态资源（CSS、JS、图片等）
  if (url.pathname.startsWith('/assets/') || 
      url.pathname.startsWith('/css/') || 
      url.pathname.startsWith('/js/') ||
      url.pathname.startsWith('/images/')) {
    return; // 让浏览器直接请求静态文件服务器
  }

  // 🔥 不拦截静态文件（根据文件扩展名）
  const staticFileExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.eot'];
  if (staticFileExtensions.some(ext => url.pathname.endsWith(ext))) {
    return; // 让浏览器直接处理静态文件
  }

  // 静态HTML缓存策略（仅 / 和 /index.html）
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            })
            .catch(() => {
              // 🔥 修复：确保总是返回有效的Response
              return new Response('Network error', { status: 503 });
            });
        })
    );
    return;
  }

  // API缓存策略（当前已禁用）
  if (API_CACHE_PATTERNS.some(pattern => url.pathname.startsWith(pattern))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              if (response) {
                // 返回缓存，同时更新缓存
                fetch(request)
                  .then((fetchResponse) => {
                    if (fetchResponse.status === 200) {
                      cache.put(request, fetchResponse.clone());
                    }
                  })
                  .catch(() => {}); // 静默失败
                return response;
              }
              
              // 缓存未命中，从网络获取
              return fetch(request)
                .then((response) => {
                  if (response.status === 200) {
                    cache.put(request, response.clone());
                  }
                  return response;
                })
                .catch(() => {
                  return new Response('Network error', { status: 503 });
                });
            });
        })
    );
    return;
  }

  // 🔥 其他SPA路由：返回index.html（Cache-first策略）
  // 使用原始请求URL，让Cloudflare Pages Functions处理重定向
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // 如果缓存中有响应，检查是否是有效的HTML响应
        if (cachedResponse && cachedResponse.status === 200) {
          return cachedResponse;
        }
        
        // 🔥 修复：使用原始请求URL fetch，让服务器处理重定向
        // 明确设置 redirect mode 为 follow，确保正确处理重定向
        return fetch(request, {
          redirect: 'follow',
          credentials: 'same-origin',
          cache: 'no-cache' // 确保总是从服务器获取最新内容
        })
          .then((fetchResponse) => {
            // 只缓存成功的HTML响应（200状态码）
            if (fetchResponse.status === 200 && fetchResponse.headers.get('content-type')?.includes('text/html')) {
              const responseClone = fetchResponse.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  // 同时缓存原始请求和 /index.html
                  cache.put(request, responseClone);
                  cache.put('/index.html', responseClone.clone());
                })
                .catch(() => {
                  // 静默处理缓存错误
                });
            }
            return fetchResponse;
          })
          .catch((error) => {
            // 如果网络请求失败，尝试返回缓存的 index.html
            return caches.match('/index.html')
              .then((fallbackResponse) => {
                if (fallbackResponse) {
                  return fallbackResponse;
                }
                // 如果连缓存都没有，返回错误响应
                return new Response('Network error', { 
                  status: 503,
                  headers: { 'Content-Type': 'text/plain' }
                });
              });
          });
      })
  );
});

// 消息处理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

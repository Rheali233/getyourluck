/**
 * Cloudflare Pages Functions - Root Level Middleware
 * 
 * This middleware handles the routing logic for the entire application:
 * 1. Static assets (/css/, /js/, /assets/, etc.) - pass through to static hosting
 * 2. API requests (/api/*) - handled by api/_middleware.js
 * 3. SPA routes - fallback to index.html
 */

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 🔥 关键修复：首先检查静态文件，确保静态资源不被中间件处理
  // 如果 _routes.json 配置正确，这些请求不应该到达中间件
  // 但为了安全起见，我们在这里也进行检查
  const staticPaths = ['/assets/', '/css/', '/js/', '/images/', '/scripts/'];
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.json', '.xml', '.txt', '.map'];
  const staticFiles = ['/robots.txt', '/sitemap.xml', '/sw.js', '/_routes.json'];
  const staticFilePrefixes = ['/favicon', '/apple-touch-icon'];

  // Check if the request is for a static file
  const isStaticFile = 
    staticPaths.some(path => pathname.startsWith(path)) ||
    staticExtensions.some(ext => pathname.endsWith(ext)) ||
    staticFiles.includes(pathname) ||
    staticFilePrefixes.some(prefix => pathname.startsWith(prefix));

  // If it's a static file, use ASSETS API to fetch it directly
  // 🔥 关键修复：使用 env.ASSETS 直接获取静态资源，避免被路由到 index.html
  if (isStaticFile) {
    if (env && env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse) {
        const assetContentType = assetResponse.headers.get('content-type') || '';
        if (assetResponse.status !== 404 && !(assetContentType.includes('text/html') && pathname !== '/index.html')) {
          return assetResponse;
        }
      }
    }

    const response = await next();
    const contentType = response.headers.get('content-type') || '';
    if (response.status === 404 || (contentType.includes('text/html') && pathname !== '/index.html')) {
      return new Response('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        }
      });
    }

    return response;
  }

  // 🔥 HTTP 到 HTTPS 重定向（仅在生产环境）
  if (url.protocol === 'http:' && (url.hostname === 'selfatlas.net' || url.hostname === 'www.selfatlas.net')) {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  // 🔥 服务器端 301 重定向：旧路径到新路径（SEO优化）
  const redirectMap = {
    '/psychology': '/tests/psychology',
    '/career': '/tests/career',
    '/astrology': '/tests/astrology',
    '/tarot': '/tests/tarot',
    '/numerology': '/tests/numerology',
    '/learning': '/tests/learning',
    '/relationship': '/tests/relationship',
  };

  // 检查精确匹配的旧路径
  if (redirectMap[pathname]) {
    const redirectUrl = new URL(redirectMap[pathname], url.origin);
    redirectUrl.search = url.search; // 保留查询参数
    return Response.redirect(redirectUrl.toString(), 301);
  }

  // 检查带子路径的旧路径（如 /career/holland -> /tests/career/holland）
  for (const [oldPath, newPath] of Object.entries(redirectMap)) {
    if (pathname.startsWith(oldPath + '/')) {
      const newPathname = pathname.replace(oldPath, newPath);
      const redirectUrl = new URL(newPathname, url.origin);
      redirectUrl.search = url.search; // 保留查询参数
      return Response.redirect(redirectUrl.toString(), 301);
    }
  }

  // 🔥 重要：API 请求 (/api/*) 直接在根级别处理，避免路由冲突
  if (pathname.startsWith('/api/')) {
    try {
      const hostname = url.hostname;
      let backendBaseUrl;
      if (hostname === 'selfatlas.net' || hostname === 'www.selfatlas.net') {
        backendBaseUrl = 'https://selfatlas-backend-prod.cyberlina.workers.dev';
      } else if (hostname.includes('pages.dev')) {
        backendBaseUrl = 'https://selfatlas-backend-staging.cyberlina.workers.dev';
      } else {
        backendBaseUrl = 'https://selfatlas-backend-staging.cyberlina.workers.dev';
      }
      
      const backendUrl = `${backendBaseUrl}${pathname}${url.search}`;
      
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': url.origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID, X-API-Key',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
          },
        });
      }
      
      const clonedRequest = request.clone();
      const backendRequest = new Request(backendUrl, {
        method: clonedRequest.method,
        headers: clonedRequest.headers,
        body: clonedRequest.body,
        redirect: 'follow',
      });
      
      const backendResponse = await fetch(backendRequest);
      const clonedResponse = backendResponse.clone();
      
      const response = new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: clonedResponse.headers,
      });
      
      response.headers.set('Access-Control-Allow-Origin', url.origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID, X-API-Key');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
      response.headers.set('Vary', 'Origin');
      
      return response;
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Proxy error',
        message: error.message,
        timestamp: new Date().toISOString(),
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  // For all other requests (SPA routes), try to get the requested resource first
  const response = await next();

  // If the resource exists (status 200), return it
  if (response.status === 200) {
    return response;
  }

  // For 404 or any other status, check if this is a static resource request
  // 🔥 关键修复：静态资源请求如果返回 404，应该直接返回 404，而不是 index.html
  // 这样可以避免静态资源被错误地返回为 HTML，导致 MIME 类型错误
  const isStaticResourceRequest = 
    staticPaths.some(path => pathname.startsWith(path)) ||
    staticExtensions.some(ext => pathname.endsWith(ext)) ||
    staticFiles.includes(pathname) ||
    staticFilePrefixes.some(prefix => pathname.startsWith(prefix));

  // 如果是静态资源请求且返回 404，直接返回 404，不要返回 index.html
  if (isStaticResourceRequest && response.status === 404) {
    return response;
  }

  // For non-static resource 404s, return index.html for SPA routing
  // This ensures that all routes work correctly when refreshed
  // 🔥 重要：只有非静态文件的 404 才返回 index.html
  try {
    if (env && env.ASSETS) {
      const indexResponse = await env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
      if (indexResponse && indexResponse.status === 200) {
        return new Response(indexResponse.body, {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        });
      }
    }

    const indexUrl = new URL('/index.html', request.url);
    const indexResponse = await fetch(indexUrl);
    
    if (indexResponse.ok) {
      return new Response(indexResponse.body, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    }
  } catch (error) {
    console.error('Failed to fetch index.html:', error);
  }

  // If we can't fetch index.html, return the original response
  return response;
}


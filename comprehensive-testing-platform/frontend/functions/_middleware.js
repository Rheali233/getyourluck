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

  // List of static file extensions and paths
  // 🔥 关键修复：优先检查路径前缀，确保所有静态资源都被正确识别
  const staticPaths = ['/assets/', '/css/', '/js/', '/images/', '/favicon', '/apple-touch-icon'];
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.json', '.xml', '.txt', '.map'];
  const staticFiles = ['/robots.txt', '/sitemap.xml', '/sw.js', '/_routes.json', '/index.html'];

  // Check if the request is for a static file
  // 优先级：路径前缀 > 文件扩展名 > 特定文件
  const isStaticFile = staticPaths.some(path => pathname.startsWith(path)) ||
                       staticExtensions.some(ext => pathname.endsWith(ext)) ||
                       staticFiles.includes(pathname);

  // If it's a static file, let it pass through to Cloudflare Pages static hosting
  // 🔥 关键：不经过任何处理，直接返回静态文件
  if (isStaticFile) {
    return next();
  }

  // For all other requests (SPA routes), try to get the requested resource first
  const response = await next();

  // If the resource exists (status 200), return it
  if (response.status === 200) {
    return response;
  }

  // For 404 or any other status, return index.html for SPA routing
  // This ensures that all routes work correctly when refreshed
  try {
    // Fetch index.html from the static files
    const indexUrl = new URL('/index.html', request.url);
    const indexResponse = await fetch(indexUrl);
    
    if (indexResponse.ok) {
      // Return index.html with original URL preserved (for client-side routing)
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


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

  // List of static file extensions and paths
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.json', '.xml', '.txt', '.html'];
  const staticPaths = ['/assets/', '/css/', '/js/', '/images/', '/favicon', '/apple-touch-icon', '/robots.txt', '/sitemap.xml', '/sw.js', '/_routes.json', '/index.html', '/ga-test.html'];

  // Check if the request is for a static file
  const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext)) ||
                       staticPaths.some(path => pathname === path || pathname.startsWith(path));

  // If it's a static file or API request, let it pass through
  if (isStaticFile || pathname.startsWith('/api/')) {
    return next();
  }

  // For all other requests, try to get the requested resource
  const response = await next();

  // If the resource exists (status 200), return it
  if (response.status === 200) {
    return response;
  }

  // If the resource doesn't exist (404), return index.html for SPA routing
  if (response.status === 404) {
    // Fetch index.html from the same origin
    const indexResponse = await fetch(new URL('/index.html', request.url));
    
    if (!indexResponse.ok) {
      return response; // If index.html also fails, return original 404
    }
    
    // Return index.html with original URL (for client-side routing)
    return new Response(indexResponse.body, {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  }

  // For other status codes, return the response as is
  return response;
}


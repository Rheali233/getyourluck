/**
 * Cloudflare Pages Functions - API Proxy
 * 
 * This function proxies all /api/* requests to the backend Worker
 * while preserving HTTP methods, headers, and body.
 */

interface Env {
  // Add your environment variables here if needed
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  
  // Build the backend URL
  // /api/analytics/events → https://backend/api/analytics/events
  const backendUrl = `https://selfatlas-backend-prod.cyberlina.workers.dev${url.pathname}${url.search}`;
  
  // Forward the request to the backend
  const backendRequest = new Request(backendUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined,
  });
  
  // Get the response from the backend
  const backendResponse = await fetch(backendRequest);
  
  // Create a new response with CORS headers
  const response = new Response(backendResponse.body, backendResponse);
  
  // Add/override CORS headers
  response.headers.set('Access-Control-Allow-Origin', url.origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID, X-API-Key');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  // Handle OPTIONS preflight
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
  
  return response;
};


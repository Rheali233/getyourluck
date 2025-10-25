/**
 * Cloudflare Pages Functions - API Proxy
 * 
 * This function proxies all /api/* requests to the backend Worker
 * while preserving HTTP methods, headers, and body.
 */

export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    
    // Build the backend URL
    const backendUrl = `https://selfatlas-backend-prod.cyberlina.workers.dev${url.pathname}${url.search}`;
    
    // Handle OPTIONS preflight first
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
    
    // Clone the request to avoid body already read errors
    const clonedRequest = request.clone();
    
    // Forward the request to the backend
    // Use request.body directly instead of arrayBuffer()
    const backendRequest = new Request(backendUrl, {
      method: clonedRequest.method,
      headers: clonedRequest.headers,
      body: clonedRequest.body,
      redirect: 'follow',
    });
    
    // Get the response from the backend
    const backendResponse = await fetch(backendRequest);
    
    // Clone the response before reading
    const clonedResponse = backendResponse.clone();
    
    // Create a new response with CORS headers
    const response = new Response(clonedResponse.body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: clonedResponse.headers,
    });
    
    // Add/override CORS headers
    response.headers.set('Access-Control-Allow-Origin', url.origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID, X-API-Key');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Vary', 'Origin');
    
    return response;
  } catch (error) {
    // Return error response with CORS
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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID, X-API-Key',
      },
    });
  }
}


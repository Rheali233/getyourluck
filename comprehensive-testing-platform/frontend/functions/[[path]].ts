// Cloudflare Pages Functions for SPA routing
// This handles ALL requests and decides whether to serve static files or index.html

export async function onRequest(context: any) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Try to get the asset first
  const response = await env.ASSETS.fetch(request);

  // If asset exists (200) or is a redirect (3xx), return it
  if (response.status < 400) {
    return response;
  }

  // If asset doesn't exist (404), serve index.html for SPA routing
  // EXCEPT for API calls
  if (pathname.startsWith('/api/')) {
    return response; // Return the 404 for API calls
  }

  // For all other 404s, serve index.html (SPA routing)
  const indexResponse = await env.ASSETS.fetch(new URL('/index.html', request.url));
  return new Response(indexResponse.body, {
    status: 200,
    headers: indexResponse.headers
  });
}


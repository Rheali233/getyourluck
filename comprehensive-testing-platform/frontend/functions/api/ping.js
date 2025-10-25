/**
 * Simple test endpoint to verify Functions are working
 */
export async function onRequest() {
  return new Response(JSON.stringify({ 
    ok: true, 
    from: 'cloudflare-pages-functions',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'X-From': 'functions',
      'Access-Control-Allow-Origin': '*'
    },
  });
}


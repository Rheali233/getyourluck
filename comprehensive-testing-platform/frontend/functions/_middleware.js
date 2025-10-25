// Cloudflare Pages Functions middleware
// This ensures static files are served correctly before SPA routing

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 直接放行所有静态资源请求（不做任何处理）
  if (
    path.startsWith('/assets/') ||
    path.startsWith('/images/') ||
    path.startsWith('/css/') ||
    path.startsWith('/js/') ||
    path.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|json|xml|txt|pdf)$/)
  ) {
    return next();
  }
  
  // API 代理
  if (path.startsWith('/api/')) {
    const apiUrl = `https://selfatlas-backend-prod.cyberlina.workers.dev${path}${url.search}`;
    return fetch(new Request(apiUrl, request));
  }
  
  // 对于其他所有请求，尝试获取静态文件
  const response = await next();
  
  // 如果文件存在（200），直接返回
  if (response.status === 200) {
    return response;
  }
  
  // 如果文件不存在（404），返回 index.html 用于 SPA 路由
  if (response.status === 404) {
    const indexResponse = await env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
    return new Response(indexResponse.body, {
      status: 200,
      headers: indexResponse.headers
    });
  }
  
  return response;
}

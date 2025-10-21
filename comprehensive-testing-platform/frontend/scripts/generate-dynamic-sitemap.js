/**
 * 动态生成sitemap.xml脚本
 * 从后端API获取博客文章并生成sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  baseUrl: 'https://2ff5182e.getyourluck-testing-platform.pages.dev',
  apiUrl: 'https://selfatlas-backend-staging.cyberlina.workers.dev',
  outputPath: path.join(__dirname, '../public/sitemap.xml')
};

// 静态页面配置
const STATIC_PAGES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/tests', priority: 0.9, changefreq: 'daily' },
  { path: '/blog', priority: 0.7, changefreq: 'daily' },
  { path: '/psychology', priority: 0.8, changefreq: 'weekly' },
  { path: '/career', priority: 0.8, changefreq: 'weekly' },
  { path: '/astrology', priority: 0.8, changefreq: 'weekly' },
  { path: '/tarot', priority: 0.8, changefreq: 'weekly' },
  { path: '/numerology', priority: 0.8, changefreq: 'weekly' },
  { path: '/learning', priority: 0.8, changefreq: 'weekly' },
  { path: '/relationship', priority: 0.8, changefreq: 'weekly' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/cookies', priority: 0.3, changefreq: 'yearly' }
];

// 获取博客文章
async function fetchBlogArticles() {
  try {
    const response = await fetch(`${CONFIG.apiUrl}/api/blog/articles?limit=1000`);
    const data = await response.json();
    
    if (data.success && data.data && Array.isArray(data.data)) {
      return data.data.map(article => ({
        path: `/blog/${article.slug || article.id}`,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: article.updatedAt || article.publishDate || new Date().toISOString()
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch blog articles:', error);
    return [];
  }
}

// 生成sitemap XML
function generateSitemapXML(staticPages, blogArticles) {
  const allPages = [...staticPages, ...blogArticles];
  const now = new Date().toISOString();
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';
  
  const urlEntries = allPages.map(page => `
  <url>
    <loc>${CONFIG.baseUrl}${page.path}</loc>
    <lastmod>${page.lastmod || now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');
  
  return `${xmlHeader}
${urlsetOpen}${urlEntries}
${urlsetClose}`;
}

// 主函数
async function generateSitemap() {
  try {
    console.log('🔄 Generating dynamic sitemap...');
    
    // 获取博客文章
    const blogArticles = await fetchBlogArticles();
    console.log(`📝 Found ${blogArticles.length} blog articles`);
    
    // 生成XML
    const xml = generateSitemapXML(STATIC_PAGES, blogArticles);
    
    // 写入文件
    fs.writeFileSync(CONFIG.outputPath, xml, 'utf8');
    
    console.log(`✅ Sitemap generated successfully: ${CONFIG.outputPath}`);
    console.log(`📊 Total URLs: ${STATIC_PAGES.length + blogArticles.length}`);
    
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error);
    process.exit(1);
  }
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export { generateSitemap, fetchBlogArticles };

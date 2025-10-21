import { execSync } from 'child_process';
import fs from 'fs';

async function syncBlogArticles() {
  console.log('🔄 Starting blog articles sync...');
  
  try {
    // Export blog articles from local
    console.log('📤 Exporting blog articles from local...');
    execSync('npx wrangler d1 execute selfatlas-local --local --command "SELECT * FROM blog_articles ORDER BY created_at;" --json > /tmp/local_blog_articles.json', { stdio: 'inherit' });
    
    const localData = JSON.parse(fs.readFileSync('/tmp/local_blog_articles.json', 'utf8'));
    const articles = localData[0].results;
    
    console.log(`📊 Found ${articles.length} blog articles in local environment`);
    
    // Clear staging blog articles
    console.log('🧹 Clearing staging blog articles...');
    execSync('CLOUDFLARE_API_TOKEN=5jNvulOMARh__1v7m7V9bkPd-n2-9BplfSrTZim7 npx wrangler d1 execute getyourluck-staging --env=staging --remote --command "DELETE FROM blog_articles;" --json', { stdio: 'inherit' });
    
    // Clear production blog articles
    console.log('🧹 Clearing production blog articles...');
    execSync('CLOUDFLARE_API_TOKEN=5jNvulOMARh__1v7m7V9bkPd-n2-9BplfSrTZim7 npx wrangler d1 execute selfatlas-prod --env=production --remote --command "DELETE FROM blog_articles;" --json', { stdio: 'inherit' });
    
    // Insert articles into staging
    console.log('📥 Inserting articles into staging...');
    for (const article of articles) {
      const insertSQL = `INSERT INTO blog_articles (id, title, content, excerpt, category, tags_data, view_count, like_count, is_published, is_featured, published_at, created_at, updated_at, slug, cover_image) VALUES ('${article.id}', '${article.title.replace(/'/g, "''")}', '${article.content.replace(/'/g, "''")}', '${article.excerpt.replace(/'/g, "''")}', '${article.category}', '${article.tags_data}', ${article.view_count}, ${article.like_count}, ${article.is_published}, ${article.is_featured}, '${article.published_at}', '${article.created_at}', '${article.updated_at}', '${article.slug}', '${article.cover_image}');`;
      
      execSync(`CLOUDFLARE_API_TOKEN=5jNvulOMARh__1v7m7V9bkPd-n2-9BplfSrTZim7 npx wrangler d1 execute getyourluck-staging --env=staging --remote --command "${insertSQL}" --json`, { stdio: 'inherit' });
    }
    
    // Insert articles into production
    console.log('📥 Inserting articles into production...');
    for (const article of articles) {
      const insertSQL = `INSERT INTO blog_articles (id, title, content, excerpt, category, tags_data, view_count, like_count, is_published, is_featured, published_at, created_at, updated_at, slug, cover_image) VALUES ('${article.id}', '${article.title.replace(/'/g, "''")}', '${article.content.replace(/'/g, "''")}', '${article.excerpt.replace(/'/g, "''")}', '${article.category}', '${article.tags_data}', ${article.view_count}, ${article.like_count}, ${article.is_published}, ${article.is_featured}, '${article.published_at}', '${article.created_at}', '${article.updated_at}', '${article.slug}', '${article.cover_image}');`;
      
      execSync(`CLOUDFLARE_API_TOKEN=5jNvulOMARh__1v7m7V9bkPd-n2-9BplfSrTZim7 npx wrangler d1 execute selfatlas-prod --env=production --remote --command "${insertSQL}" --json`, { stdio: 'inherit' });
    }
    
    console.log('✅ Blog articles sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

syncBlogArticles();

#!/bin/bash

echo "🔄 Starting blog data sync from local to staging..."

# 1. 清空staging数据库的博客文章
echo "🗑️ Clearing staging blog articles..."
cd /Users/meowz/project/Web/getyourluck/comprehensive-testing-platform/backend
wrangler d1 execute getyourluck-staging --remote --command="DELETE FROM blog_articles;"

# 2. 从本地数据库导出博客文章数据
echo "📖 Exporting blog articles from local database..."
wrangler d1 execute selfatlas-local --local --command="SELECT id, title, content, excerpt, category, tags_data, view_count, like_count, is_published, is_featured, published_at, created_at, updated_at, slug, cover_image FROM blog_articles WHERE is_published = 1 ORDER BY created_at DESC;" > /tmp/local_blog_articles.json

# 3. 解析JSON并插入到staging数据库
echo "📝 Inserting articles to staging database..."

# 使用Node.js脚本来处理JSON数据
node -e "
const fs = require('fs');
const { execSync } = require('child_process');

try {
  const data = JSON.parse(fs.readFileSync('/tmp/local_blog_articles.json', 'utf8'));
  const articles = data[0].results;
  
  console.log(\`Found \${articles.length} articles to sync\`);
  
  for (const article of articles) {
    // 转义单引号
    const escapedTitle = article.title.replace(/'/g, \"''\");
    const escapedContent = article.content.replace(/'/g, \"''\");
    const escapedExcerpt = article.excerpt.replace(/'/g, \"''\");
    
    const command = \`wrangler d1 execute getyourluck-staging --remote --command=\"INSERT INTO blog_articles (id, title, content, excerpt, category, tags_data, view_count, like_count, is_published, is_featured, published_at, created_at, updated_at, slug, cover_image) VALUES ('\${article.id}', '\${escapedTitle}', '\${escapedContent}', '\${escapedExcerpt}', '\${article.category}', '\${article.tags_data}', \${article.view_count || 0}, \${article.like_count || 0}, \${article.is_published}, \${article.is_featured || 0}, '\${article.published_at}', '\${article.created_at}', '\${article.updated_at}', '\${article.slug}', \${article.cover_image ? \`'\${article.cover_image}'\` : 'NULL'});\"\`;
    
    try {
      execSync(command, { stdio: 'pipe' });
      console.log(\`✅ Inserted: \${article.title}\`);
    } catch (error) {
      console.error(\`❌ Failed to insert: \${article.title}\`, error.message);
    }
  }
  
  console.log('🎉 Blog data sync completed!');
} catch (error) {
  console.error('❌ Error processing blog data:', error.message);
  process.exit(1);
}
"

echo "✅ Blog sync completed!"

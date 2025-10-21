#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

async function syncMissingBlogArticles() {
  console.log('🔄 Starting missing blog articles sync...');
  
  try {
    // 1. 从staging环境导出缺失的博客文章
    console.log('📤 Exporting missing articles from staging...');
    execSync('npx wrangler d1 execute getyourluck-staging --env=staging --remote --command "SELECT * FROM blog_articles WHERE id NOT IN (\\"intro-001\\", \\"numerology-names-001\\", \\"gemini-man-deep-dive\\") ORDER BY created_at;" --json > /tmp/missing_blog_articles.json', { stdio: 'inherit' });
    
    // 2. 读取导出的数据
    const data = JSON.parse(fs.readFileSync('/tmp/missing_blog_articles.json', 'utf8'));
    const articles = data[0].results;
    
    console.log(`📊 Found ${articles.length} missing articles to sync`);
    
    // 3. 为每篇文章创建SQL并执行
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      console.log(`🔄 Syncing article ${i + 1}/${articles.length}: ${article.title}`);
      
      const sqlContent = generateInsertSQL(article);
      const filename = `/tmp/missing_blog_${i + 1}.sql`;
      
      fs.writeFileSync(filename, sqlContent);
      
      // 执行SQL
      try {
        execSync(`npx wrangler d1 execute selfatlas-prod --env=production --remote --file=${filename}`, { stdio: 'inherit' });
        console.log(`✅ Article ${i + 1} synced successfully`);
      } catch (error) {
        console.error(`❌ Article ${i + 1} failed:`, error.message);
        // 继续处理下一篇文章
      }
      
      // 清理临时文件
      fs.unlinkSync(filename);
    }
    
    console.log('🎉 Missing blog articles sync completed!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

function generateInsertSQL(article) {
  const id = article.id.replace(/'/g, "''");
  const title = article.title.replace(/'/g, "''");
  const content = article.content.replace(/'/g, "''");
  const excerpt = article.excerpt.replace(/'/g, "''");
  const category = article.category.replace(/'/g, "''");
  const tagsData = article.tags_data.replace(/'/g, "''");
  const slug = article.slug.replace(/'/g, "''");
  const coverImage = article.cover_image ? article.cover_image.replace(/'/g, "''") : 'NULL';
  
  return `INSERT OR REPLACE INTO blog_articles (
    id, title, content, excerpt, category, tags_data, 
    view_count, like_count, is_published, is_featured, 
    published_at, created_at, updated_at, slug, cover_image
  ) VALUES (
    '${id}', 
    '${title}', 
    '${content}', 
    '${excerpt}', 
    '${category}', 
    '${tagsData}', 
    ${article.view_count}, 
    ${article.like_count}, 
    ${article.is_published ? 1 : 0}, 
    ${article.is_featured ? 1 : 0}, 
    '${article.published_at}', 
    '${article.created_at}', 
    '${article.updated_at}', 
    '${slug}', 
    ${coverImage === 'NULL' ? 'NULL' : `'${coverImage}'`}
  );`;
}

// 运行同步
syncMissingBlogArticles();

#!/usr/bin/env tsx

import { Database } from '@cloudflare/workers-types';

interface BlogArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags_data: string;
  view_count: number;
  like_count: number;
  is_published: number;
  is_featured: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  slug: string;
  cover_image?: string;
}

async function syncBlogData() {
  console.log('🔄 Starting blog data sync from local to staging...');
  
  try {
    // 1. 从本地数据库获取所有已发布的博客文章
    console.log('📖 Fetching blog articles from local database...');
    const localArticles = await getLocalBlogArticles();
    console.log(`✅ Found ${localArticles.length} articles in local database`);
    
    // 2. 清空staging数据库的博客文章
    console.log('🗑️ Clearing staging blog articles...');
    await clearStagingBlogArticles();
    
    // 3. 将本地文章插入到staging数据库
    console.log('📝 Inserting articles to staging database...');
    for (const article of localArticles) {
      await insertArticleToStaging(article);
      console.log(`✅ Inserted: ${article.title}`);
    }
    
    console.log('🎉 Blog data sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Error syncing blog data:', error);
    process.exit(1);
  }
}

async function getLocalBlogArticles(): Promise<BlogArticle[]> {
  const { execSync } = require('child_process');
  
  const command = `cd /Users/meowz/project/Web/getyourluck/comprehensive-testing-platform/backend && wrangler d1 execute selfatlas-local --local --command="SELECT id, title, content, excerpt, category, tags_data, view_count, like_count, is_published, is_featured, published_at, created_at, updated_at, slug, cover_image FROM blog_articles WHERE is_published = 1 ORDER BY created_at DESC;"`;
  
  const result = execSync(command, { encoding: 'utf8' });
  const data = JSON.parse(result);
  
  return data[0].results.map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    category: row.category,
    tags_data: row.tags_data,
    view_count: row.view_count || 0,
    like_count: row.like_count || 0,
    is_published: row.is_published,
    is_featured: row.is_featured || 0,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    slug: row.slug,
    cover_image: row.cover_image || null
  }));
}

async function clearStagingBlogArticles() {
  const { execSync } = require('child_process');
  
  const command = `cd /Users/meowz/project/Web/getyourluck/comprehensive-testing-platform/backend && wrangler d1 execute getyourluck-staging --remote --command="DELETE FROM blog_articles;"`;
  
  execSync(command, { encoding: 'utf8' });
  console.log('✅ Cleared staging blog articles');
}

async function insertArticleToStaging(article: BlogArticle) {
  const { execSync } = require('child_process');
  
  // 转义单引号
  const escapedTitle = article.title.replace(/'/g, "''");
  const escapedContent = article.content.replace(/'/g, "''");
  const escapedExcerpt = article.excerpt.replace(/'/g, "''");
  
  const command = `cd /Users/meowz/project/Web/getyourluck/comprehensive-testing-platform/backend && wrangler d1 execute getyourluck-staging --remote --command="INSERT INTO blog_articles (id, title, content, excerpt, category, tags_data, view_count, like_count, is_published, is_featured, published_at, created_at, updated_at, slug, cover_image) VALUES ('${article.id}', '${escapedTitle}', '${escapedContent}', '${escapedExcerpt}', '${article.category}', '${article.tags_data}', ${article.view_count}, ${article.like_count}, ${article.is_published}, ${article.is_featured}, '${article.published_at}', '${article.created_at}', '${article.updated_at}', '${article.slug}', ${article.cover_image ? `'${article.cover_image}'` : 'NULL'});"`;
  
  execSync(command, { encoding: 'utf8' });
}

// 运行同步
syncBlogData();
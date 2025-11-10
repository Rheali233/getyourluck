#!/usr/bin/env tsx
/* eslint-disable no-console */

/**
 * Markdown → D1 导入脚本
 * 使用方式：
 *   npx tsx scripts/import-blog-md.ts ../content/blog/2025/mbti-compatibility-personality-relationships.md --db selfatlas-local --local
 *   npx tsx scripts/import-blog-md.ts ../content/blog/2025 --db getyourluck-staging --remote
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import sanitizeHtml from 'sanitize-html';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');


interface FrontMatter {
  id?: string;
  slug?: string;
  title: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  cover?: string;
  status?: string;
  isFeatured?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

interface ExistingArticle {
  view_count: number;
  like_count: number;
  created_at?: string;
}

type Mode = 'local' | 'remote';

const markdown = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItAnchor, {
  level: [2, 3],
  slugify: (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-'),
});

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  'img',
  'figure',
  'figcaption',
  'h1',
  'h2',
  'h3',
  'h4',
  'pre',
  'code',
  'table',
  'thead',
  'tbody',
  'th',
  'td',
  'tr',
  'div',
  'span',
  'details',
  'summary',
]);

const allowedAttributes: sanitizeHtml.IOptions['allowedAttributes'] = {
  ...sanitizeHtml.defaults.allowedAttributes,
  img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
  a: ['href', 'name', 'target', 'rel', 'class'],
  div: ['class'],
  span: ['class'],
  details: ['open'],
  summary: ['class'],
};

function parseArgs() {
  const files: string[] = [];
  let dbBinding = 'DB';
  let mode: Mode = 'local';

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--db') {
      const value = args[i + 1];
      if (!value) {
        throw new Error('Missing value for --db option');
      }
      dbBinding = value;
      i += 1;
      continue;
    }
    if (arg === '--local') {
      mode = 'local';
      continue;
    }
    if (arg === '--remote') {
      mode = 'remote';
      continue;
    }
    files.push(arg);
  }

  if (files.length === 0) {
    throw new Error('No markdown file or directory provided.');
  }

  return { files, dbBinding, mode };
}

function collectMarkdownFiles(inputPaths: string[]): string[] {
  const result: string[] = [];
  for (const rawPath of inputPaths) {
    const resolved = path.resolve(rawPath);
    if (!fs.existsSync(resolved)) {
      console.warn(`⚠️  Path does not exist: ${resolved}`);
      continue;
    }
    const stat = fs.statSync(resolved);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(resolved);
      for (const entry of entries) {
        if (entry.endsWith('.md')) {
          result.push(path.join(resolved, entry));
        }
      }
    } else if (stat.isFile() && resolved.endsWith('.md')) {
      result.push(resolved);
    } else {
      console.warn(`⚠️  Ignore non-markdown path: ${resolved}`);
    }
  }
  return result;
}

function escapeSql(value: string | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }
  return value.replace(/'/g, "''");
}

function extractExcerpt(html: string): string {
  const stripped = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ') ;
  return stripped.trim().slice(0, 280);
}

function runD1Command(sql: string, dbBinding: string, mode: Mode, parseJson = false) {
  const flags = mode === 'local' ? '--local' : '--remote';
  const jsonFlag = parseJson ? '--json' : '';
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-import-'));
  const sqlFile = path.join(tempDir, 'command.sql');
  fs.writeFileSync(sqlFile, sql, 'utf8');

  const fullCommand = `cd ${backendRoot} && wrangler d1 execute ${dbBinding} ${flags} ${jsonFlag} --file=${sqlFile}`;
  const output = execSync(fullCommand, { encoding: 'utf8' });

  fs.unlinkSync(sqlFile);
  fs.rmdirSync(tempDir);

  return output;
}

function fetchExistingArticle(id: string, dbBinding: string, mode: Mode): ExistingArticle | null {
  const selectSQL = `SELECT view_count, like_count, created_at FROM blog_articles WHERE id = '${escapeSql(id)}' LIMIT 1;`;
  try {
    const raw = runD1Command(selectSQL, dbBinding, mode, true);
    const parsed = JSON.parse(raw);
    const row = parsed?.[0]?.results?.[0];
    if (!row) {
      return null;
    }
    return {
      view_count: Number(row.view_count ?? 0),
      like_count: Number(row.like_count ?? 0),
      created_at: row.created_at as string | undefined,
    };
  } catch (error) {
    console.warn(`⚠️  Failed to fetch existing article (${id}): ${(error as Error).message}`);
    return null;
  }
}

function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: {
          ...attribs,
          rel: 'noopener',
          target: '_blank',
        },
      }),
    },
  });
}

function ensureFrontMatter(data: FrontMatter, filePath: string) {
  if (!data.title) {
    throw new Error(`Missing 'title' in front matter: ${filePath}`);
  }
  if (!data.slug) {
    throw new Error(`Missing 'slug' in front matter: ${filePath}`);
  }
}

async function main() {
  try {
    const { files, dbBinding, mode } = parseArgs();
    const markdownFiles = collectMarkdownFiles(files);

    if (markdownFiles.length === 0) {
      console.error('❌ No markdown files detected.');
      process.exit(1);
    }

    console.log(`📝 Preparing to import ${markdownFiles.length} article(s)...`);

    for (const filePath of markdownFiles) {
      console.log(`\n📄 Processing ${filePath}`);
      const rawContent = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(rawContent);
      const { data, content } = {
        data: parsed.data as unknown as FrontMatter,
        content: parsed.content,
      };
      ensureFrontMatter(data, filePath);

      const id = data.id || data.slug!;
      const slug = data.slug!;
      const title = data.title.trim();
      const category = data.category || '';
      const tagsJSON = JSON.stringify(data.tags || []);
      const isPublished = data.status?.toLowerCase() === 'published';
      const isFeatured = Boolean(data.isFeatured);
      const publishedAt = data.publishedAt || new Date().toISOString();
      const updatedAt = data.updatedAt || new Date().toISOString();
      const coverImage = data.cover || null;

      const renderedHtml = markdown.render(content);
      const sanitizedHtml = sanitize(renderedHtml);
      const excerpt = data.excerpt?.trim() || extractExcerpt(sanitizedHtml);

      const existing = fetchExistingArticle(id, dbBinding, mode);
      const viewCount = existing?.view_count ?? 0;
      const likeCount = existing?.like_count ?? 0;
      const createdAt = existing?.created_at || publishedAt;

      const insertSQL = `INSERT INTO blog_articles (id, title, content, excerpt, category, tags_data, view_count, like_count, is_published, is_featured, published_at, created_at, updated_at, slug, cover_image)
VALUES ('${escapeSql(id)}', '${escapeSql(title)}', '${escapeSql(sanitizedHtml)}', '${escapeSql(excerpt)}', '${escapeSql(category)}', '${escapeSql(tagsJSON)}', ${viewCount}, ${likeCount}, ${isPublished ? 1 : 0}, ${isFeatured ? 1 : 0}, '${escapeSql(publishedAt)}', '${escapeSql(createdAt)}', '${escapeSql(updatedAt)}', '${escapeSql(slug)}', ${coverImage ? `'${escapeSql(coverImage)}'` : 'NULL'})
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  content = excluded.content,
  excerpt = excluded.excerpt,
  category = excluded.category,
  tags_data = excluded.tags_data,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured,
  published_at = excluded.published_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at,
  slug = excluded.slug,
  cover_image = excluded.cover_image;`;

      runD1Command(insertSQL, dbBinding, mode);
      console.log(`✅ Imported: ${title}`);
    }

    console.log('\n🎉 All articles imported successfully.');
  } catch (error) {
    console.error(`❌ ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();



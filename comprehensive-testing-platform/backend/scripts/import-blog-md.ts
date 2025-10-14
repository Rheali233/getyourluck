/**
 * Import Markdown blog articles into D1 (Cloudflare)
 * - Parse Front Matter
 * - Convert Markdown → Safe HTML (limited)
 * - Upsert into blog_articles
 *
 * Usage:
 * npx tsx scripts/import-blog-md.ts ../content/blog/2025/09/welcome.md --db getyourluck-local --local
 */

// 简化实现：不引入外部依赖，提供足够可用的解析能力

import { readFileSync, statSync, readdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

interface FrontMatter {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  cover?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published';
  publishedAt?: string;
  updatedAt?: string;
}

function parseFrontMatter(raw: string): { fm: FrontMatter; body: string } {
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\n---\s*[\r\n]+([\s\S]*)$/);
  if (!match) throw new Error('Front Matter not found. The file must start with ---');
  const yaml = match[1];
  const body = match[2];
  const fm: any = {};
  yaml.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!m) return;
    const key = m[1];
    let value: any = m[2].trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      try { value = JSON.parse(value); } catch {}
    } else if (value === 'true' || value === 'false') {
      value = value === 'true';
    } else if (/^\".*\"$/.test(value) || /^'.*'$/.test(value)) {
      value = value.slice(1, -1);
    }
    fm[key] = value;
  });
  if (!fm.slug || !fm.title) throw new Error('slug and title are required in Front Matter');
  return { fm, body };
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;');
}

function mdToSafeHtml(md: string): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  let inCode = false;
  let codeLang = '';
  const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };
  for (const raw of lines) {
    const line = raw.trim();
    // fenced code block
    if (line.startsWith('```')) {
      if (!inCode) {
        closeList();
        inCode = true;
        codeLang = line.slice(3).trim();
        out.push(`<pre><code class=\"language-${escapeHtml(codeLang)}\">`);
      } else {
        inCode = false;
        out.push('</code></pre>');
      }
      continue;
    }
    if (inCode) { out.push(escapeHtml(raw)); continue; }

    // horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) { closeList(); out.push('<hr />'); continue; }
    if (line.startsWith('### ')) { closeList(); out.push(`<h3>${escapeHtml(line.slice(4))}</h3>`); continue; }
    if (line.startsWith('## ')) { closeList(); out.push(`<h2 id=\"${slugify(line.slice(3))}\">${escapeHtml(line.slice(3))}</h2>`); continue; }
    if (line.startsWith('# ')) { closeList(); out.push(`<h1>${escapeHtml(line.slice(2))}</h1>`); continue; }
    if (/^\-\s+/.test(line)) { if (!inList) { out.push('<ul>'); inList = true; } out.push(`<li>${escapeInline(line.replace(/^\-\s+/, ''))}</li>`); continue; }
    if (line === '') { closeList(); out.push('<p></p>'); continue; }
    out.push(`<p>${escapeInline(line)}</p>`);
  }
  closeList();
  return out.join('');
}

function escapeInline(s: string) {
  // image ![alt](url)
  s = s.replace(/!\[(.*?)\]\((.*?)\)/g, (_m, alt, url) => `<img src=\"${escapeHtml(url)}\" alt=\"${escapeHtml(alt)}\" loading=\"lazy\" />`);
  // link [text](url)
  s = s.replace(/\[(.*?)\]\((.*?)\)/g, (_m, text, url) => `<a href=\"${escapeHtml(url)}\">${escapeHtml(text)}</a>`);
  // bold/italic
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
  return s.split(/\n/).map(escapeHtml).join('\n');
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function execSql(sql: string, local: boolean, dbBinding: string) {
  const { execSync } = await import('node:child_process');
  // 将 SQL 写入临时文件，避免引号转义问题
  const filePath = join(tmpdir(), `import_blog_${Date.now()}.sql`);
  writeFileSync(filePath, sql, 'utf-8');
  const base = `npx wrangler d1 execute ${dbBinding}`;
  const flags = local ? ' --local' : ' --remote';
  const cmd = `${base}${flags} --file ${JSON.stringify(filePath)}`;
  execSync(cmd, { stdio: 'inherit' });
}

async function upsertArticle(fm: FrontMatter, html: string, local: boolean, dbBinding: string, dryRun: boolean) {
  const id = fm.id || fm.slug;
  const now = new Date().toISOString();
  const isPublished = fm.status === 'published' ? 1 : 0;
  const publishedAt = fm.publishedAt ? `'${fm.publishedAt}'` : (isPublished ? `'${now}'` : 'NULL');
  const updatedAt = fm.updatedAt ? `'${fm.updatedAt}'` : `'${now}'`;
  const tagsJson = JSON.stringify(fm.tags || []);
  const safeExcerpt = (fm.excerpt || '').replace(/'/g, "''");
  const safeTitle = (fm.title || '').replace(/'/g, "''");
  const safeCategory = (fm.category || '').replace(/'/g, "''");
  const safeMetaTitle = (fm.metaTitle || '').replace(/'/g, "''");
  const safeMetaDesc = (fm.metaDescription || '').replace(/'/g, "''");
  const safeCover = (fm.cover || '').replace(/'/g, "''");
  const safeOg = ((fm.ogImage || fm.cover || '')).replace(/'/g, "''");
  const safeSlug = (fm.slug || '').replace(/'/g, "''");
  const safeHtml = html.replace(/'/g, "''");

  const sql = `
  INSERT INTO blog_articles (
    id, title, content, excerpt, category, tags_data,
    slug, cover_image,
    view_count, like_count, is_published, is_featured,
    published_at, created_at, updated_at
  ) VALUES (
    '${id}', '${safeTitle}', '${safeHtml}', '${safeExcerpt}', '${safeCategory}', '${tagsJson}',
    '${safeSlug}', '${safeCover}',
    0, 0, ${isPublished}, ${fm.isFeatured ? 1 : 0},
    ${publishedAt}, '${now}', ${updatedAt}
  )
  ON CONFLICT(id) DO UPDATE SET
    title='${safeTitle}', content='${safeHtml}', excerpt='${safeExcerpt}', category='${safeCategory}',
    tags_data='${tagsJson}', slug='${safeSlug}', cover_image='${safeCover}',
    is_published=${isPublished}, is_featured=${fm.isFeatured ? 1 : 0},
    published_at=${publishedAt}, updated_at=${updatedAt}
  ;`.trim();

  if (dryRun) {
    console.log(`[DRY-RUN] Would import: ${fm.slug} (published=${!!isPublished})`);
    return;
  }
  await execSql(sql, local, dbBinding);
}

function collectFiles(entry: string): string[] {
  const st = statSync(entry);
  if (st.isFile()) return [entry];
  const res: string[] = [];
  for (const f of readdirSync(entry)) {
    const p = join(entry, f);
    const s = statSync(p);
    if (s.isDirectory()) res.push(...collectFiles(p));
    else if (extname(p) === '.md') res.push(p);
  }
  return res;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: import-blog-md.ts <file-or-dir> --db <binding> [--local|--remote] [--dry-run]');
    process.exit(1);
  }
  const target = args[0];
  const local = args.includes('--local');
  const dryRun = args.includes('--dry-run');
  const dbIdx = args.indexOf('--db');
  const dbBinding = dbIdx >= 0 ? args[dbIdx + 1] : 'selfatlas-local';
  const files = collectFiles(target);
  if (files.length === 0) { console.error('No markdown files found'); process.exit(1); }

  let imported = 0; let skipped = 0; const slugs: string[] = [];
  for (const file of files) {
    try {
      const raw = readFileSync(file, 'utf-8');
      const { fm, body } = parseFrontMatter(raw);
      const html = mdToSafeHtml(body);
      await upsertArticle(fm as FrontMatter, html, local, dbBinding, dryRun);
      imported++;
      slugs.push((fm as FrontMatter).slug);
      console.log(`${dryRun ? '📝 DRY' : '✅'} ${fm.slug}`);
    } catch (e: any) {
      skipped++;
      console.error(`❌ Skip ${file}: ${e.message}`);
    }
  }

  console.log(`\nSummary: imported=${imported}, skipped=${skipped}`);
  if (slugs.length) {
    console.log('Slugs:', slugs.join(', '));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });



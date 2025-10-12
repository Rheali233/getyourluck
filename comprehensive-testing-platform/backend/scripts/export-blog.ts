/**
 * Export a blog article to Markdown + Front Matter by slug
 * Usage:
 * npx tsx scripts/export-blog.ts <slug> --db getyourluck-local --local
 */

import { execSync } from 'node:child_process';

function query(sql: string, local: boolean, db: string): any {
  const base = `npx wrangler d1 execute ${db}`;
  const flags = local ? ' --local' : ' --remote';
  const cmd = `${base}${flags} --command ${JSON.stringify(sql)} --json`;
  const out = execSync(cmd, { encoding: 'utf-8' });
  const lines = out.split('\n');
  const last = lines[lines.length - 1] || '[]';
  try { return JSON.parse(last)[0]?.results?.[0] || {}; } catch { return {}; }
}

function toFrontMatter(row: any): string {
  const tags = row.tags_data || '[]';
  return `---\nslug: ${row.slug}\ntitle: "${row.title}"\nexcerpt: "${row.excerpt || ''}"\ncategory: ${row.category || ''}\ntags: ${tags}\ncover: \nmetaTitle: \nmetaDescription: \nogImage: \nisFeatured: ${row.is_featured ? 'true' : 'false'}\nstatus: ${row.is_published ? 'published' : 'draft'}\npublishedAt: ${row.published_at || ''}\nupdatedAt: ${row.updated_at || ''}\n---\n`;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: export-blog.ts <slug> --db <binding> [--local|--remote]');
    process.exit(1);
  }
  const slug = args[0];
  const dbIdx = args.indexOf('--db');
  const dbBinding = dbIdx >= 0 ? args[dbIdx + 1] : 'selfatlas-local';
  const local = args.includes('--local');

  const row = query(`SELECT * FROM blog_articles WHERE slug='${slug.replace(/'/g, "''")}' LIMIT 1;`, local, dbBinding);
  if (!row || !row.id) { console.error('Article not found'); process.exit(1); }
  const fm = toFrontMatter(row);
  const md = `${fm}${row.content || ''}\n`;
  process.stdout.write(md);
}

main().catch((e) => { console.error(e); process.exit(1); });



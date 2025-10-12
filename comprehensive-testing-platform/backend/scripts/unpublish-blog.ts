/**
 * Unpublish a blog article by slug (set is_published = 0)
 * Usage:
 * npx tsx scripts/unpublish-blog.ts <slug> --db getyourluck-local --local
 */

import { execSync } from 'node:child_process';

function run(sql: string, local: boolean, db: string) {
  const base = `npx wrangler d1 execute ${db}`;
  const flags = local ? ' --local' : ' --remote';
  const cmd = `${base}${flags} --command ${JSON.stringify(sql)}`;
  execSync(cmd, { stdio: 'inherit' });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: unpublish-blog.ts <slug> --db <binding> [--local|--remote]');
    process.exit(1);
  }
  const slug = args[0];
  const dbIdx = args.indexOf('--db');
  const dbBinding = dbIdx >= 0 ? args[dbIdx + 1] : 'selfatlas-local';
  const local = args.includes('--local');

  const sql = `UPDATE blog_articles SET is_published = 0 WHERE slug = '${slug.replace(/'/g, "''")}';`;
  run(sql, local, dbBinding);
  console.log(`✅ Unpublished: ${slug}`);
}

main().catch((e) => { console.error(e); process.exit(1); });



/*
  Script: scripts/generate_blog_posts.js
  Usage: node scripts/generate_blog_posts.js
  Reads content/mental-health-blogs-draft.md and generates posts in app/blog/<slug>/page.tsx
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRAFT_PATH = path.join(ROOT, 'content', 'mental-health-blogs-draft.md');
const BLOG_DIR = path.join(ROOT, 'app', 'blog');

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function readDraft() {
  if (!fs.existsSync(DRAFT_PATH)) {
    throw new Error(`Draft file not found at ${DRAFT_PATH}`);
  }
  return fs.readFileSync(DRAFT_PATH, 'utf8');
}

function parsePosts(markdown) {
  const lines = markdown.split(/\r?\n/);
  const posts = [];
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      // Start new post
      if (current) {
        posts.push(current);
      }
      const rawTitle = line.replace(/^##\s+/, '').replace(/^\d+\)\s*/, '').trim();
      current = { title: rawTitle, contentLines: [] };
      continue;
    }
    if (line.trim() === '---') {
      // Separator: finish current if present
      if (current) {
        posts.push(current);
        current = null;
      }
      continue;
    }
    if (current) {
      current.contentLines.push(line);
    }
  }
  if (current) posts.push(current);

  // Clean up content: trim leading/trailing blank lines
  return posts
    .map(p => {
      const content = p.contentLines.join('\n').replace(/^[\n\s]+|[\n\s]+$/g, '');
      return { title: p.title, content };
    })
    .filter(p => p.title && p.content);
}

function describe(text, maxLen = 160) {
  const clean = text
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

function escapeJsxText(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function contentToStaticJsx(content) {
  const paragraphs = content.split(/\n\s*\n/);
  return paragraphs
    .map(p => `<p>${escapeJsxText(p).replace(/\n/g, '<br />')}</p>`) // preserve single newlines
    .join('\n');
}

function generatePageTSX({ title, description, content }) {
  const staticJsx = contentToStaticJsx(content);
  const safeDescription = description.replace(/"/g, '\\"');
  return `import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '${title} | talkAI',
  description: "${safeDescription}",
  openGraph: {
    title: '${title} | talkAI',
    description: "${safeDescription}",
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title} | talkAI',
    description: "${safeDescription}"
  }
};

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Mental Health</Badge>
              <Badge variant="outline">Guides</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">${title}</h1>
            <p className="text-slate-600 dark:text-slate-300">${safeDescription}</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
${staticJsx}
          </div>

          <div className="mt-10">
            <Link href="/auth" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Support →
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
`;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writePost({ title, content }) {
  const slug = slugify(title);
  const description = describe(content);
  const dir = path.join(BLOG_DIR, slug);
  ensureDir(dir);
  const pagePath = path.join(dir, 'page.tsx');
  const tsx = generatePageTSX({ title, description, content });
  fs.writeFileSync(pagePath, tsx, 'utf8');
  return { slug, pagePath };
}

function main() {
  const md = readDraft();
  const posts = parsePosts(md);
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error('No posts parsed from draft markdown.');
  }
  const created = posts.map(writePost);
  console.log('Generated posts:', created.map(c => c.slug).join(', '));
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

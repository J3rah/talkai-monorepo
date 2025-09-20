import fs from 'fs/promises';
import path from 'path';

export async function get_faq_privacy_terms_disclaimer() {
  // Read the markdown content of each page
  const base = path.join(process.cwd(), 'content');
  const [faq, privacy, terms, disclaimer] = await Promise.all([
    fs.readFile(path.join(base, 'faq.md'), 'utf8'),
    fs.readFile(path.join(base, 'privacy.md'), 'utf8'),
    fs.readFile(path.join(base, 'terms.md'), 'utf8'),
    fs.readFile(path.join(base, 'disclaimer.md'), 'utf8'),
  ]);
  return {
    faq,
    privacy,
    terms,
    disclaimer,
  };
} 
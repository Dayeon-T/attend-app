import { globby } from 'globby';
import fs from 'node:fs/promises';
import path from 'node:path';
import strip from 'strip-comments';

const exts = ['js','jsx','ts','tsx','css','html','yml','yaml'];
const patterns = [
  `**/*.{${exts.join(',')}}`,
  '.gitignore',
  '.env',
  '!.git/**',
  '!node_modules/**',
  '!dist/**',
];

const stripCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
const stripHtml = (s) => {
  let out = s.replace(/<!--[\s\S]*?-->/g, '');
  // <script> 내부 JS 주석도 제거
  out = out.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (_, open, js, close) => {
    try { return open + strip(js, { preserveNewlines: true }) + close; }
    catch { return open + js + close; }
  });
  return out;
};
const stripYaml = (s) => s.replace(/(^|\n)\s*#.*(?=\n|$)/g, '\n');
const stripHash = (s) => s.replace(/(^|\n)\s*#.*(?=\n|$)/g, '\n'); // .gitignore/.env

const handlers = {
  js: (s) => strip(s, { preserveNewlines: true }),
  jsx: (s) => strip(s, { preserveNewlines: true }),
  ts: (s) => strip(s, { preserveNewlines: true }),
  tsx: (s) => strip(s, { preserveNewlines: true }),
  css: stripCss,
  html: stripHtml,
  yml: stripYaml,
  yaml: stripYaml,
  gitignore: stripHash,
  env: stripHash,
};

const run = async () => {
  const files = await globby(patterns, { dot: true });
  for (const file of files) {
    const ext = file === '.gitignore' ? 'gitignore'
              : file === '.env' ? 'env'
              : path.extname(file).slice(1).toLowerCase();
    const fn = handlers[ext];
    if (!fn) continue;
    const before = await fs.readFile(file, 'utf8');
    const after = fn(before);
    if (after !== before) {
      await fs.writeFile(file, after, 'utf8');
      console.log('stripped:', file);
    }
  }
};
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
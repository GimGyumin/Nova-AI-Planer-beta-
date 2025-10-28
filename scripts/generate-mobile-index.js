#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const assetsDir = path.resolve(process.cwd(), 'mobile-app', 'assets');
if (!fs.existsSync(assetsDir)) {
  console.error('mobile-app/assets not found. Build output may be missing.');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const js = files.find(f => f.startsWith('entry-mobile') && f.endsWith('.js'));
const css = files.find(f => f.startsWith('entry-mobile') && f.endsWith('.css'));

if (!js) {
  console.error('Could not find built entry-mobile JS in mobile-app/assets');
  process.exit(1);
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Nova AI Planner - Mobile</title>
    ${css ? `<link rel="stylesheet" href="./assets/${css}">` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/${js}"></script>
  </body>
</html>`;

fs.writeFileSync(path.resolve(process.cwd(), 'mobile-app', 'index.html'), html, 'utf8');
console.log('mobile-app/index.html generated');

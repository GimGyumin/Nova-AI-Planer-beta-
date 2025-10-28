#!/usr/bin/env node
import { build } from 'vite';

async function run() {
  try {
    console.log('Starting mobile build...');
    await build({
      build: {
        outDir: 'mobile-dist',
        rollupOptions: {
          input: 'src/entry-mobile.tsx'
        }
      }
    });
    console.log('Mobile build finished: mobile-dist/');
  } catch (e) {
    console.error('Mobile build failed:', e);
    process.exit(1);
  }
}

run();

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from "@tailwindcss/vite";
import path, { resolve } from 'path';
import fs from 'fs';

const contentScriptsEntries = Object.fromEntries(
  fs.readdirSync('src/content-scripts')
    .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
    .map(file => [
      file.replace(/\.(ts|tsx)$/, ''), // content-scripts/ 빼기
      resolve(__dirname, `src/content-scripts/${file}`)
    ])
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  base: './',
  root: 'src/side-panel',
  build: {
    outDir: path.resolve(__dirname, 'dist'),  // 루트 경로 기준 dist
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'side-panel': path.resolve(__dirname, 'src/side-panel/index.html'),
        'service-worker': path.resolve(__dirname, 'src/service-worker/index.ts'),
        ...contentScriptsEntries,
      },
      output: {
        entryFileNames: assetInfo => {
          if (contentScriptsEntries[assetInfo.name]) {
            return `content-scripts/${assetInfo.name}.js`;
          }
          if (assetInfo.name === 'service-worker') {
            return 'service-worker/index.js';
          }
          return '[name]/index.js';
        },
      },
    },
  },
  publicDir: path.resolve(__dirname, 'public'),
});

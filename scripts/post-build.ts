import fs from 'fs-extra';
import path from 'path';

async function main() {
  const distDir = path.resolve(process.cwd(), 'dist');

  // 1. manifest.json 덮어쓰기
  const baseManifestPath = path.resolve(process.cwd(), 'manifest.json');
  const builtManifestPath = path.resolve(distDir, 'manifest.json');

  if (await fs.pathExists(baseManifestPath)) {
    await fs.copyFile(baseManifestPath, builtManifestPath);
    console.log('manifest.json copied to dist');
  }

  // 2. assets 폴더 dist/assets로 복사
  const assetsSrc = path.resolve(process.cwd(), 'assets');
  const assetsDest = path.resolve(distDir, 'assets');

  if (await fs.pathExists(assetsSrc)) {
    await fs.copy(assetsSrc, assetsDest);
    console.log('Assets copied to dist/assets');
  }

  console.log('Postbuild 작업 완료');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

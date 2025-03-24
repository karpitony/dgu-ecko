import fs from 'fs-extra';
import path from 'path';

async function main() {
  try {
    // 1. 최종 합친 결과물을 넣을 dist 폴더
    const distRoot = path.join(__dirname, 'dist');
    await fs.remove(distRoot);

    // 2. src/popup/dist -> dist/popup
    const popupDist = path.join(__dirname, 'src', 'popup', 'dist');
    const distPopup = path.join(distRoot, 'popup');
    await fs.copy(popupDist, distPopup);
    console.log('Copied src/popup/dist -> dist/popup');

    // 3. src/side_panel/dist -> dist/side_panel
    const sidePanelDist = path.join(__dirname, 'src', 'side_panel', 'dist');
    const distSidePanel = path.join(distRoot, 'side_panel');
    await fs.copy(sidePanelDist, distSidePanel);
    console.log('Copied src/side_panel/dist -> dist/side_panel');

    // 4. dist_ts(컨텐츠 스크립트, 서비스워커 등 TSC 컴파일 결과) -> dist/ts
    const distTs = path.join(__dirname, 'dist_ts');
    const distTsTarget = path.join(distRoot);
    await fs.copy(distTs, distTsTarget);
    console.log('Copied dist_ts -> dist/');

    // 5. manifest.json -> dist/manifest.json
    const manifestSrc = path.join(__dirname, 'manifest.json');
    const manifestDest = path.join(distRoot, 'manifest.json');
    await fs.copy(manifestSrc, manifestDest);
    console.log('Copied manifest.json -> dist/manifest.json');

    // 6. assets(아이콘/이미지) -> dist/assets
    const assetsSrc = path.join(__dirname, 'assets');
    const assetsDest = path.join(distRoot, 'assets');
    await fs.copy(assetsSrc, assetsDest);
    console.log('Copied assets -> dist/assets');

    console.log('Merge dist done!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    $schema: 'https://json.schemastore.org/chrome-manifest',
    manifest_version: 3,
    name: '이코 (이클래스 도와주는 코끼리)',
    description: '동국대학교 이클래스 보조 확장 프로그램입니다.',
    permissions: ['scripting', 'storage', 'tabs', 'sidePanel'],
    host_permissions: ['https://eclass.dongguk.edu/*'],
    icons: {
      '16': '/icons/icon16.png',
      '48': '/icons/icon48.png',
      '128': '/icons/icon128.png',
    },
  },
});

# 이코: 이클래스 도와주는 코끼리

<p align="center">
  <br>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"/></a>
  <a href="https://chromewebstore.google.com/detail/이코-이클래스-도와주는-코끼리/jmcmadbhcejffmkgomehebjpglhfmggp"><img src="https://img.shields.io/chrome-web-store/v/jmcmadbhcejffmkgomehebjpglhfmggp.svg" alt="chrome-webstore"/></a>
  <a href="https://chromewebstore.google.com/detail/이코-이클래스-도와주는-코끼리/jmcmadbhcejffmkgomehebjpglhfmggp"><img src="https://img.shields.io/chrome-web-store/d/jmcmadbhcejffmkgomehebjpglhfmggp.svg" alt="users"></a>
  <br>
</p>

![screenshot](./assets/screenshot01.png)

[![My Skills](https://skillicons.dev/icons?i=ts,react,tailwindcss,vite,pnpm)](https://skillicons.dev)

- 이코는 동국대학교 eclass를 더 편리하게 사용할 수 있도록 도와주는 크롬 확장 프로그램입니다.
- 과제 마감일, 온라인 강의 시청 현황 등을 한눈에 확인할 수 있어 학습 관리가 더 쉬워집니다.
- 주차별 과제 목록 3주차로 확장, 화면을 가리는 공지 모달 숨기기 등 UX 개선도 제공합니다.
- [설치하러 가기](https://chromewebstore.google.com/detail/이코-이클래스-도와주는-코끼리/jmcmadbhcejffmkgomehebjpglhfmggp)
- PR, 이슈 환영합니다.

## 폴더구조

```
ecko/
├── .vscode/                # vscode를 위한 prettier 자동 적용 설정
├── assets/
├── entrypoints/            # 확장 프로그램 소스 코드
│   ├── background/         # 백그라운드 스크립트 (서비스 워커)
│   ├── side-panel/         # 사이드 패널 UI React 코드
│   └── {name}.content.ts   # 페이지에 삽입될 콘텐츠 스크립트들
├── libs/                   # 유틸 함수들 모음
├── types/
├── package.json
├── wxt.config.ts          # wxt + vite config 파일
└── README.md
```

- `wxt` 프레임워크를 기반으로 동작하므로 `wxt`의 개발문서를 보시면 프로젝트 구조 이해가 쉽게 되실겁니다!
- https://wxt.dev/guide/essentials/project-structure.html

## 개발 환경 세팅 및 빌드

```bash
git clone https://github.com/karpitony/dgu-ecko.git
cd dgu-ecko
```

```bash
npm install -g pnpm@10.5.2
pnpm install
pnpm run dev
```

- 이 프로젝트는 `pnpm`을 사용합니다.
- `pnpm run dev`시 기본 크롬 + 아무것도 없는 사이트가 나옵니다.
  `web-ext.config.ts`를 추가하고 간단한 설정을 넣어서 브라우저와 사이트를 지정해줄 수 있습니다.

  ```ts
  import { defineWebExtConfig } from 'wxt';

  export default defineWebExtConfig({
    binaries: {},
    startUrls: ['https://eclass.dongguk.edu/'],
  });
  ```

## 기여하기

- 포크 후 PR을 편하게 보내주세요.
- 이슈나 개선점을 자유롭게 제안해 주세요.
- 함께 개선시켜 나아가봐요!
- 커밋 메시지는 명확하고 간결하게 작성 부탁드립니다.
  - `feat/fix/chore/refactor/style: 메시지` 형태로 적으면 좋고, 별도의 body, footer 등의 제약은 없습니다.

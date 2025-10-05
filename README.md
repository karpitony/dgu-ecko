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
│   │   ├── index.ts        # 진입점 (의존성 주입 및 메시지 라우팅)
│   │   ├── types/          # 타입 정의
│   │   │   ├── messages.ts      # 메시지 타입
│   │   │   ├── storage.ts       # 스토리지 데이터 타입
│   │   │   └── services.ts      # 서비스 인터페이스
│   │   ├── utils/          # 유틸리티
│   │   │   ├── constants.ts     # 상수 정의
│   │   │   └── promiseUtils.ts  # Promise 헬퍼
│   │   ├── repositories/   # 데이터 액세스 레이어
│   │   │   ├── StorageRepository.ts  # Chrome Storage 추상화
│   │   │   └── CacheRepository.ts    # 캐싱 로직 전담
│   │   ├── managers/       # 인프라 관리
│   │   │   ├── ContentScriptManager.ts # 콘텐츠 스크립트 삽입 관리
│   │   │   ├── TabManager.ts           # 탭 관리
│   │   │   └── MessageHandler.ts       # 메시지 라우팅
│   │   └── services/       # 비즈니스 로직
│   │       ├── CourseService.ts       # 강의 목록 관리
│   │       ├── VodService.ts          # VOD 데이터 수집/관리
│   │       ├── AssignmentService.ts   # 과제 데이터 수집/관리
│   │       └── SidePanelService.ts    # 사이드패널 관련
│   ├── sidepanel/          # 사이드 패널 UI React 코드
│   └── {name}.content.ts   # 페이지에 삽입될 콘텐츠 스크립트들
├── libs/                   # 유틸 함수들 모음
├── types/                  # 전역 타입 정의
├── package.json
├── wxt.config.ts          # wxt + vite config 파일
└── README.md
```

- `wxt` 프레임워크를 기반으로 동작하므로 `wxt`의 개발문서를 보시면 프로젝트 구조 이해가 쉽게 되실겁니다!
- https://wxt.dev/guide/essentials/project-structure.html

### Background 폴더 구조 및 동작 원리

Background 스크립트는 **레이어드 아키텍처(Layered Architecture)** 패턴을 따르며, 각 레이어는 명확한 책임을 가집니다.

#### 📐 아키텍처 레이어

```
┌─────────────────────────────────────────┐
│         index.ts (진입점)                │  ← 의존성 주입, 메시지 라우팅 설정
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Services (비즈니스 로직)             │  ← 강의/VOD/과제 데이터 수집 로직
│  CourseService, VodService, etc.        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Managers (인프라 관리)               │  ← 콘텐츠 스크립트, 탭, 메시지 관리
│  ContentScriptManager, TabManager, etc. │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Repositories (데이터 액세스)            │  ← Chrome Storage 추상화, 캐싱
│  StorageRepository, CacheRepository     │
└─────────────────────────────────────────┘
```

#### 🔄 데이터 흐름

1. **사이드패널**에서 VOD/과제 데이터 요청 메시지 전송
2. **MessageHandler**가 메시지 타입 확인 후 적절한 Service로 라우팅
3. **Service**가 CacheRepository에서 캐시 확인
   - 캐시 유효: 즉시 반환
   - 캐시 무효: 콘텐츠 스크립트 실행
4. **ContentScriptManager**가 이클래스 페이지에 스크립트 삽입
5. 콘텐츠 스크립트가 DOM 파싱 후 데이터 전송
6. **Service**가 데이터를 CacheRepository에 저장
7. 전체 수집 완료 시 사이드패널에 알림

#### 🎯 각 레이어의 역할

**Services**

- 비즈니스 로직 구현
- 데이터 수집 및 조회 흐름 제어
- 진행 상황 추적 (completedCount / totalCount)

**Managers**

- 콘텐츠 스크립트 중복 삽입 방지 (마커 태그 활용)
- 탭 메시지 전송/수신 관리
- 메시지 타입별 핸들러 라우팅

**Repositories**

- Chrome Storage API 타입 안전 래핑
- 캐시 만료 검증 (강의ID: 1주일, VOD/과제: 4시간)
- 스토리지 키 네이밍 규칙 관리

#### 💡 타입 안정성

- **Discriminated Union** 타입으로 메시지 구분
- **Interface** 기반 의존성 주입으로 테스트 용이성 확보
- **Generic Repository Pattern**으로 스토리지 타입 보장

#### ⚡ 최적화 전략

- 캐시 우선 전략으로 불필요한 네트워크 요청 최소화
- 병렬 처리(`Promise.all`)로 여러 강의 동시 수집
- 콘텐츠 스크립트 중복 삽입 방지로 메모리 효율성 확보

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

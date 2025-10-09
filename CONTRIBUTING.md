# 기여 가이드

이코 프로젝트에 관심 가져주셔서 감사합니다! 이 문서는 프로젝트 구조와 기여 방법을 안내합니다.

## 📋 목차

- [프로젝트 구조](#프로젝트-구조)
- [개발 환경 세팅](#개발-환경-세팅)
- [개발 시작하기](#개발-시작하기)
- [기여 방법](#기여-방법)
- [코딩 컨벤션](#코딩-컨벤션)

## 프로젝트 구조

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

이 프로젝트는 `wxt` 프레임워크를 기반으로 동작합니다.
더 자세한 프로젝트 구조는 [WXT 공식 문서](https://wxt.dev/guide/essentials/project-structure.html)를 참고하세요.

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

## 개발 환경 세팅

### 1. 저장소 클론

```bash
git clone https://github.com/karpitony/dgu-ecko.git
cd dgu-ecko
```

### 2. 의존성 설치

이 프로젝트는 `pnpm`을 사용합니다.

```bash
npm install -g pnpm@10.5.2
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm run dev
```

`pnpm run dev` 실행 시 기본 크롬 브라우저가 열리며 빈 페이지가 표시됩니다.

### 4. (선택) 개발 환경 커스터마이징

`web-ext.config.ts` 파일을 추가하여 브라우저와 시작 URL을 지정할 수 있습니다:

```ts
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  binaries: {},
  startUrls: ['https://eclass.dongguk.edu/'],
});
```

## 개발 시작하기

1. **이슈 확인**: 먼저 [Issues](https://github.com/karpitony/dgu-ecko/issues)에서 작업하고 싶은 이슈를 찾아보세요.
2. **브랜치 생성**: 작업할 기능이나 버그에 맞는 브랜치를 생성하세요.
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **코드 작성**: 원하는 기능을 구현하거나 버그를 수정합니다.
4. **테스트**: 변경사항이 제대로 동작하는지 확인합니다.
5. **커밋**: 의미 있는 단위로 커밋합니다.

## 기여 방법

### Pull Request 프로세스

1. 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다.
3. 변경사항을 커밋합니다.
4. 본인의 포크 저장소에 푸시합니다.
5. Pull Request를 생성합니다.

### 이슈 제안

- 버그를 발견하셨나요? [이슈](https://github.com/karpitony/dgu-ecko/issues)를 등록해 주세요.
- 새로운 기능을 제안하고 싶으신가요? 자유롭게 이슈로 제안해 주세요.
- 문서 개선도 환영합니다!

## 코딩 컨벤션

### 커밋 메시지

커밋 메시지는 명확하고 간결하게 작성해 주세요.

**형식**: `타입: 메시지`

**타입**:

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `chore`: 빌드 업무, 패키지 매니저 수정 등
- `docs`: 문서 수정

**예시**:

```
feat: 과제 마감일 알림 기능 추가
fix: 사이드패널 렌더링 오류 수정
refactor: background 스크립트 모듈화
```

별도의 body, footer 등의 제약은 없습니다.

### 코드 스타일

- 이 프로젝트는 Prettier를 사용합니다.
- `.vscode` 폴더의 설정을 통해 자동 포맷팅이 적용됩니다.
- TypeScript를 사용하며, 타입 안정성을 중요시합니다.

## 질문이 있으신가요?

프로젝트에 대해 궁금한 점이 있다면 [이슈](https://github.com/karpitony/dgu-ecko/issues)로 질문해 주세요.
함께 이코를 발전시켜 나가요! 🐘

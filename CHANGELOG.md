# Changelog

## `v0.3.6` (2025-09-02)

- 수업 목록(`courseIds`)에 대한 만료 검사가 없어서 추가

## `v0.3.5` (2025-09-01)

- 학기 바뀌고 이전 데이터 남아있는 문제 수정
- 이클래스 홈에서 DOM 파싱 로직을 fetch 후 HTML 파싱하는 로직으로 수정

## `v0.3.4` (2025-05-29)

- D-Day 카운트에서 `ceil`대신 `round`로 변경
- D-Day 표시 색상을 촘촘하게 수정하고, 빨간색은 D-1, D-Day만
- 페이지 라우팅을 직접 만든 라우터에서 `react-router` 패키지 모드로 변경
- https://github.com/karpitony/dgu-ecko/releases/tag/v0.3.4

## `v0.3.3` (2025-05-23)

- 캐시체크 로직관련 오류 수정
- **변경된 이클래스 과제 정보 확인 페이지에 대응**
- `courseId`가 비어있는 문제에서 재시도 로직 추가
- https://github.com/karpitony/dgu-ecko/releases/tag/v0.3.3

## `v0.3.1` (2025-05-21)

- Vite로 확장 프로그램 빌드하도록 수정
- `확인된 CRX 업로드` 문제 수정 후 크롬 스토어에 다시 등록
- https://github.com/karpitony/dgu-ecko/releases/tag/v0.3.1

## `v0.3.0` (2025-05-16)

- 캐시 무효화 및 사이드 패널에서 데이터 새로고침 및 업데이트 시간 확인가능
- `courseIds`를 빈배열로 저장하고, 불러오려는 문제 수정

## `v0.2.0` (2025-05-15)

- 크롬 스토어에 등록
- 첫화면에서 요청이 실패하는 오류 수정
- https://github.com/karpitony/dgu-ecko/releases/tag/v0.2

## `v0.1.0` (2025-05-14)

- 사이드 패널로 과제 모아보기만 있는 첫 버전 제작
- https://github.com/karpitony/dgu-ecko/releases/tag/v0.1

// 1. 데이터 정의
const RAW_CONFIG = [
  {
    groupName: '확장프로그램 설정',
    items: [
      {
        key: 'autoCloseSidePanelOnTabChange',
        label: '이클래스 이탈 시 패널 자동 닫기',
        description: '다른 사이트로 이동하거나 탭을 전환하면 사이드패널을 자동으로 숨깁니다.',
        defaultValue: true,
      },
    ],
  },
  {
    groupName: '이클래스 사용성 개선',
    items: [
      { key: 'joyrideBlockEnabled', label: 'AI 튜터 툴팁 가리기', defaultValue: true },
      { key: 'modalBlockEnabled', label: '공지사항 팝업 자동 가리기', defaultValue: true },
      {
        key: 'notificationBadgeFixEnabled',
        label: '알림 숫자 표시 오류 수정',
        defaultValue: true,
        isBeta: true,
      },
    ],
  },
  {
    groupName: '학습 편의 기능',
    items: [
      { key: 'courseMultiSection', label: '강의실 주차 탭 확장', defaultValue: true, isBeta: true },
      {
        key: 'tempActiveTabSelector',
        label: '현재 주차 탭 자동 선택',
        defaultValue: true,
        isBeta: true,
      },
    ],
  },
] as const;

// 2. 데이터로부터 타입 추출
export type SettingKey = (typeof RAW_CONFIG)[number]['items'][number]['key'];

export type ExtensionSettings = {
  [K in SettingKey]: boolean;
};

export interface SettingItem {
  readonly key: SettingKey;
  readonly label: string;
  readonly defaultValue: boolean;
  readonly isBeta?: boolean;
  readonly description?: string;
}

export interface SettingGroup {
  readonly groupName: string;
  readonly items: readonly SettingItem[];
}

// 3. UI에서 사용할 정제된 설정 객체
export const SETTINGS_CONFIG: readonly SettingGroup[] = RAW_CONFIG;

// 4. 초기값 추출
export const DEFAULT_SETTINGS: ExtensionSettings = RAW_CONFIG.reduce((acc, group) => {
  group.items.forEach(item => {
    (acc as any)[item.key] = item.defaultValue;
  });
  return acc;
}, {} as ExtensionSettings);

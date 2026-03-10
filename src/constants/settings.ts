// 1. 데이터 정의
const RAW_CONFIG = [
  {
    groupName: '시스템 설정',
    items: [
      {
        key: 'autoCloseSidePanelOnTabChange',
        label: '탭 전환시 자동으로 닫히기',
        defaultValue: true,
      },
    ],
  },
  {
    groupName: '사용 편의 기능',
    items: [
      { key: 'joyrideBlockEnabled', label: 'AI 튜터 툴팁 끄기', defaultValue: true },
      { key: 'modalBlockEnabled', label: '공지 모달 가리기', defaultValue: true },
      {
        key: 'notificationBadgeFixEnabled',
        label: '알림 배지 표시 오류 수정',
        defaultValue: true,
        isBeta: true,
      },
    ],
  },
  {
    groupName: '학습 편의 기능',
    items: [
      { key: 'courseMultiSection', label: '주차별 보기 확장', defaultValue: true, isBeta: true },
      {
        key: 'tempActiveTabSelector',
        label: '오늘 날짜 기준 주차 탭 선택',
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

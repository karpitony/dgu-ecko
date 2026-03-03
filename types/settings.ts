export interface ExtensionSettings {
  joyrideBlockEnabled: boolean;
  modalBlockEnabled: boolean;
  courseMultiSection: boolean;
  tempActiveTabSelector: boolean;
  autoCloseSidePanelOnTabChange: boolean;
  notificationBadgeFixEnabled: boolean;
}

export type SettingKey = keyof ExtensionSettings;

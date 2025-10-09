export interface ExtensionSettings {
  joyrideBlockEnabled: boolean;
  modalBlockEnabled: boolean;
  courseMultiSection: boolean;
  tempActiveTabSelector: boolean;
  autoCloseSidePanelOnTabChange: boolean;
}

export type SettingKey = keyof ExtensionSettings;

export interface ExtensionSettings {
  joyrideBlockEnabled: boolean;
  modalBlockEnabled: boolean;
  courseMultiSection: boolean;
  tempActiveTabSelector: boolean;
}

export type SettingKey = keyof ExtensionSettings;

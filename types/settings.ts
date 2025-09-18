export interface ExtensionSettings {
  joyrideBlockEnabled: boolean;
  modalBlockEnabled: boolean;
  courseMultiSection: boolean;
}

export type SettingKey = keyof ExtensionSettings;

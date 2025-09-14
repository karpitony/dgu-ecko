export interface ExtensionSettings {
  joyrideBlockEnabled: boolean;
  modalBlockEnabled: boolean;
}

export type SettingKey = keyof ExtensionSettings;

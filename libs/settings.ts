import { ExtensionSettings, SettingKey } from '@/types/settings';

const defaultSettings: ExtensionSettings = {
  joyrideBlockEnabled: true,
  modalBlockEnabled: true,
  courseMultiSection: false,
};

/**
 * 전체 세팅 객체를 Storage에서 불러오기
 */
export function loadSettings(): Promise<ExtensionSettings> {
  return new Promise(resolve => {
    chrome.storage.sync.get('settings', result => {
      if (result.settings) {
        resolve({ ...defaultSettings, ...result.settings });
      } else {
        // Storage에 없으면 기본값 기록 후 반환
        chrome.storage.sync.set({ settings: defaultSettings });
        resolve(defaultSettings);
      }
    });
  });
}

/**
 * 특정 키의 설정 값 가져오기
 */
export async function getSetting<K extends SettingKey>(key: K): Promise<ExtensionSettings[K]> {
  await loadSettings();
  return new Promise(resolve => {
    chrome.storage.sync.get('settings', result => {
      const settings: ExtensionSettings = result.settings
        ? { ...defaultSettings, ...result.settings }
        : defaultSettings;
      resolve(settings[key]);
    });
  });
}

/**
 * 특정 키의 설정 값 변경 및 Storage 동기화
 */
export async function setSetting<K extends SettingKey>(
  key: K,
  value: ExtensionSettings[K],
): Promise<void> {
  await loadSettings();
  return new Promise(resolve => {
    chrome.storage.sync.get('settings', result => {
      const settings: ExtensionSettings = result.settings
        ? { ...defaultSettings, ...result.settings }
        : defaultSettings;

      settings[key] = value;
      chrome.storage.sync.set({ settings }, () => resolve());
    });
  });
}

/**
 * 전체 설정 덮어쓰기
 */
export function setSettings(newSettings: Partial<ExtensionSettings>): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.sync.get('settings', result => {
      const settings: ExtensionSettings = result.settings
        ? { ...defaultSettings, ...result.settings }
        : defaultSettings;

      const merged = { ...settings, ...newSettings };
      chrome.storage.sync.set({ settings: merged }, () => resolve());
    });
  });
}

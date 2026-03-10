import { ExtensionSettings, SettingKey, DEFAULT_SETTINGS } from '@/constants/settings';

let settingsCache: ExtensionSettings | null = null;

/**
 * Storage에서 전체 설정을 불러와 캐시를 업데이트합니다.
 */
export async function loadSettings(): Promise<ExtensionSettings> {
  // 이미 캐시가 있다면 즉시 반환
  if (settingsCache) return settingsCache;

  return new Promise(resolve => {
    chrome.storage.sync.get('settings', result => {
      const storedSettings = result.settings || {};
      // 기본값과 저장된 값을 합성
      const merged = { ...DEFAULT_SETTINGS, ...storedSettings };

      // 만약 저장된 값이 없었다면 초기값 저장
      if (!result.settings) {
        chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
      }

      settingsCache = merged;
      resolve(merged);
    });
  });
}

/**
 * 특정 키의 설정 값 가져오기 (캐시 우선)
 */
export async function getSetting<K extends SettingKey>(key: K): Promise<ExtensionSettings[K]> {
  const settings = await loadSettings();
  return settings[key];
}

/**
 * 특정 키의 설정 값 변경 및 캐시/Storage 동기화
 */
export async function setSetting<K extends SettingKey>(
  key: K,
  value: ExtensionSettings[K],
): Promise<void> {
  const settings = await loadSettings();

  const updatedSettings = { ...settings, [key]: value };

  return new Promise(resolve => {
    chrome.storage.sync.set({ settings: updatedSettings }, () => {
      settingsCache = updatedSettings; // 캐시 업데이트
      resolve();
    });
  });
}

/**
 * 전체 설정 덮어쓰기 (Partial 지원)
 */
export async function setSettings(newSettings: Partial<ExtensionSettings>): Promise<void> {
  const settings = await loadSettings();
  const merged = { ...settings, ...newSettings };

  return new Promise(resolve => {
    chrome.storage.sync.set({ settings: merged }, () => {
      settingsCache = merged; // 캐시 업데이트
      resolve();
    });
  });
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { loadSettings, setSetting } from '@/libs/settings';
import {
  SETTINGS_CONFIG,
  DEFAULT_SETTINGS,
  ExtensionSettings,
  SettingKey,
} from '@/constants/settings';

/**
 * 베타 배지 컴포넌트
 */
function BetaBadge() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.7rem] font-bold ml-1 bg-green-600 text-white leading-none">
      Beta
    </span>
  );
}

export default function SettingsPanel() {
  const [settings, setSettingsState] = useState<ExtensionSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings().then(setSettingsState);
  }, []);

  // 토글 핸들러
  const handleToggle = (key: SettingKey) => {
    const newValue = !settings[key];
    setSettingsState(prev => ({ ...prev, [key]: newValue }));
    setSetting(key, newValue);
  };

  return (
    <div className="p-4 w-full h-screen overflow-y-auto flex flex-col items-start gap-4">
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">설정</h2>
        <Link to="/index.html" className="text-blue-400 hover:underline text-base pr-1">
          홈으로 이동
        </Link>
      </div>

      {/* 설정 그룹 루프 */}
      {SETTINGS_CONFIG.map(group => (
        <section key={group.groupName} className="flex flex-col gap-2 w-full">
          <h3 className="text-lg font-bold uppercase tracking-wider ml-1">{group.groupName}</h3>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {group.items.map((item, index) => (
              <div
                key={item.key}
                className={`flex items-center justify-between p-4 gap-4 ${
                  index !== group.items.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center">
                    <span className="text-base">
                      {item.label} {item.isBeta && <BetaBadge />}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  )}
                </div>

                {/* 토글 스위치 */}
                <button
                  onClick={() => handleToggle(item.key as SettingKey)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out
                    ${settings[item.key as SettingKey] ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200
                    ${settings[item.key as SettingKey] ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

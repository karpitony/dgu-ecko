import { useEffect, useState } from 'react';
import { defaultSettings, loadSettings, getSetting, setSetting } from '@/libs/settings';
import { Link } from 'react-router';
import { ExtensionSettings } from '@/types/settings';

function BetaBadge() {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ml-1.5"
      style={{ backgroundColor: '#16a34a', color: '#fff', fontSize: '0.65rem', lineHeight: '1' }}
    >
      Beta
    </span>
  );
}

export default function SettingsPanel() {
  const [settings, setSettingsState] = useState<ExtensionSettings>(defaultSettings);

  useEffect(() => {
    loadSettings().then(async () => {
      setSettingsState({
        joyrideBlockEnabled: await getSetting('joyrideBlockEnabled'),
        modalBlockEnabled: await getSetting('modalBlockEnabled'),
        courseMultiSection: await getSetting('courseMultiSection'),
        tempActiveTabSelector: await getSetting('tempActiveTabSelector'),
        autoCloseSidePanelOnTabChange: await getSetting('autoCloseSidePanelOnTabChange'),
        notificationBadgeFixEnabled: await getSetting('notificationBadgeFixEnabled'),
      });
    });
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettingsState(prev => ({ ...prev, [key]: newValue }));
    setSetting(key, newValue); // 유틸 통해 storage + cache 동기화
  };

  return (
    <div className="p-4 w-full h-screen overflow-y-auto flex flex-col items-start gap-4">
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">설정</h2>
        <Link to="/index.html" className="text-blue-400 hover:underline text-base pr-1">
          홈으로 이동
        </Link>
      </div>

      {/* AI 튜터 툴팁 */}
      <div className="flex items-center justify-between w-full">
        <span className="text-base">AI 튜터 툴팁 끄기</span>
        <button
          onClick={() => handleToggle('joyrideBlockEnabled')}
          className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
            ${settings.joyrideBlockEnabled ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
        >
          <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
        </button>
      </div>

      {/* 공지 모달 */}
      <div className="flex items-center justify-between w-full">
        <span className="text-base">공지 모달 가리기</span>
        <button
          onClick={() => handleToggle('modalBlockEnabled')}
          className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
            ${settings.modalBlockEnabled ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
        >
          <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
        </button>
      </div>

      {/* 주차별 보기 확장 */}
      <div className="flex items-center justify-between w-full">
        <span className="text-base">
          주차별 보기 확장 <BetaBadge />
        </span>
        <button
          onClick={() => handleToggle('courseMultiSection')}
          className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
            ${settings.courseMultiSection ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
        >
          <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
        </button>
      </div>

      {/* 오늘 날짜 기준 주차 탭 선택 */}
      <div className="flex items-center justify-between w-full">
        <span className="text-base">
          오늘 날짜 기준 주차 탭 선택 <BetaBadge />
        </span>
        <button
          onClick={() => handleToggle('tempActiveTabSelector')}
          className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
            ${settings.tempActiveTabSelector ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
        >
          <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
        </button>
      </div>

      {/* 탭 전환시 자동으로 닫히기 */}
      <div className="flex items-center justify-between w-full">
        <span className="text-base">탭 전환시 자동으로 닫히기</span>
        <button
          onClick={() => handleToggle('autoCloseSidePanelOnTabChange')}
          className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
            ${settings.autoCloseSidePanelOnTabChange ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
        >
          <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
        </button>
      </div>

      {/* 알림 배지 보정 */}
      <div className="flex items-center justify-between w-full">
        <span className="text-base">
          알림 배지 표시 오류 수정 <BetaBadge />
        </span>
        <button
          onClick={() => handleToggle('notificationBadgeFixEnabled')}
          className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
            ${settings.notificationBadgeFixEnabled ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
        >
          <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
        </button>
      </div>
    </div>
  );
}


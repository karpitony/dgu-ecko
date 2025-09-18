import { useEffect, useState } from 'react';
import { loadSettings, getSetting, setSetting } from '@/libs/settings';
import { Link } from 'react-router';
import { ExtensionSettings } from '@/types/settings';

export default function SettingsPanel() {
  const [settings, setSettingsState] = useState<ExtensionSettings>({
    joyrideBlockEnabled: true,
    modalBlockEnabled: true,
    courseMultiSection: false,
  });

  useEffect(() => {
    loadSettings().then(async () => {
      setSettingsState({
        joyrideBlockEnabled: await getSetting('joyrideBlockEnabled'),
        modalBlockEnabled: await getSetting('modalBlockEnabled'),
        courseMultiSection: await getSetting('courseMultiSection'),
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
          주차별 보기 확장 <span className="text-green-600 font-semibold">(Beta)</span>
        </span>
        <button
          onClick={() => handleToggle('courseMultiSection')}
          className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
            ${settings.courseMultiSection ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
        >
          <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
        </button>
      </div>
    </div>
  );
}

import { getSetting } from '@/libs/settings';

export default defineContentScript({
  matches: ['https://eclass.dongguk.edu/'],
  registration: 'manifest',
  main() {
    function startJoyrideBlock() {
      document.cookie = 'aichat-event-guide=true; path=/; max-age=' + 60 * 60 * 24 * 365;

      const observer = new MutationObserver(() => {
        const btn = document.querySelector<HTMLButtonElement>('button[data-action="skip"]');
        if (btn) {
          setTimeout(() => {
            btn.click();
            console.log('AI 튜터 조이드라이브 건너뛰기 버튼 클릭됨');
            observer.disconnect(); // 클릭 후 observer 종료
          }, 50);
        } else {
          console.log('AI 튜터 조이드라이브 건너뛰기 버튼 없음');
        }
      });

      const container = document.querySelector('.joyride-container');
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
      }
    }
    (async () => {
      if (await getSetting('joyrideBlockEnabled')) {
        startJoyrideBlock();
      }
    })();
  },
});

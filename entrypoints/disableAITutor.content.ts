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
          setTimeout(() => btn.click(), 50); // 50ms 정도 딜레이
          console.log('AI 튜터 조이드라이브 건너뛰기 버튼 클릭됨');
        } else {
          console.log('AI 튜터 조이드라이브 건너뛰기 버튼 없음');
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
    (async () => {
      if (await getSetting('joyrideBlockEnabled')) {
        startJoyrideBlock();
      }
    })();
  },
});
